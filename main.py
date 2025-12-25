from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta, date
import jwt
import pyodbc
from passlib.context import CryptContext
import uvicorn
from functools import wraps

app = FastAPI(title="Vending System API")

# Конфигурация
SECRET_KEY = "vending-secret-key-2024"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 300

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение к БД
def get_db():
    conn_str = (
        "Driver={ODBC Driver 17 for SQL Server};"
        "Server=192.168.10.10;"
        "Database=user30;"  # Если имя базы другое, замените
        "UID=user30;"
        "PWD=42494;"
        "TrustServerCertificate=yes;"  # Если требуется доверять сертификату
    )
    return pyodbc.connect(conn_str)

# Утилиты
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None

class MachineCreate(BaseModel):
    serial_number: str
    inventory_number: str
    location: str
    model: str
    machine_type: str
    manufacturer: str = "Unknown"
    manufacture_date: date
    commissioning_date: date
    status: str = "Работает"
    country: str = "Россия"

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

# Аутентификация
def create_token(email: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    encoded_jwt = jwt.encode({"sub": email, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt if isinstance(encoded_jwt, str) else encoded_jwt.decode('utf-8')

def verify_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Токен истек")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Неверный токен")

# Декоратор для защиты эндпоинтов
def auth_required(func):
    @wraps(func)
    async def wrapper(token: str, *args, **kwargs):
        payload = verify_token(token)
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT UserID, Email, FullName, RoleID FROM Users WHERE Email = ?", payload.get("sub"))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not user:
            raise HTTPException(status_code=401, detail="Пользователь не найден")
            
        return await func(token, *args, **kwargs)
    return wrapper

# Роуты
@app.post("/auth/login")
async def login(user_data: UserLogin):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT UserID, Email, PasswordHash, FullName, RoleID FROM Users WHERE Email = ?", user_data.email)
        user = cursor.fetchone()
        
    if not user:
        raise HTTPException(status_code=401, detail="Пользователь не найден")
    
    # Упрощенная проверка пароля (для демо)
    try:
        valid = pwd_context.verify(user_data.password, user.PasswordHash)
    except:
        valid = user_data.password == user.PasswordHash
    
    if not valid:
        raise HTTPException(status_code=401, detail="Неверный пароль")
    
    return {
        "access_token": create_token(user.Email),
        "token_type": "bearer",
        "user": {
            "user_id": user.UserID,
            "email": user.Email,
            "full_name": user.FullName,
            "role_id": user.RoleID
        }
    }

@app.post("/auth/register")
async def register(user_data: UserRegister):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT UserID FROM Users WHERE Email = ?", user_data.email)
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Пользователь уже существует")
        
        cursor.execute("""
            INSERT INTO Users (Email, PasswordHash, FullName, Phone, RoleID, CreatedAt) 
            VALUES (?, ?, ?, ?, 2, ?)
        """, user_data.email, pwd_context.hash(user_data.password), user_data.full_name, 
           user_data.phone, datetime.now())
        conn.commit()
    
    return {"message": "Пользователь успешно зарегистрирован"}

@app.get("/machines")
@auth_required
async def get_machines(token: str):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT MachineID, SerialNumber, InventoryNumber, Location, Model, Status, TotalIncome
            FROM VendingMachines
        """)
        
        machines = [{
            "machine_id": row.MachineID,
            "serial_number": row.SerialNumber,
            "inventory_number": row.InventoryNumber,
            "location": row.Location,
            "model": row.Model,
            "status": row.Status,
            "total_income": float(row.TotalIncome or 0)
        } for row in cursor.fetchall()]
    
    return machines

@app.post("/machines")
@auth_required
async def create_machine(machine: MachineCreate, token: str):
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Проверка уникальности
        cursor.execute("SELECT MachineID FROM VendingMachines WHERE SerialNumber = ? OR InventoryNumber = ?", 
                      machine.serial_number, machine.inventory_number)
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Аппарат с таким номером уже существует")
        
        cursor.execute("""
            INSERT INTO VendingMachines 
            (SerialNumber, InventoryNumber, Location, Model, MachineType, Manufacturer,
             ManufactureDate, CommissioningDate, Status, Country, CompanyID) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        """, (machine.serial_number, machine.inventory_number, machine.location, machine.model,
              machine.machine_type, machine.manufacturer, machine.manufacture_date,
              machine.commissioning_date, machine.status, machine.country))
        conn.commit()
        
        cursor.execute("SELECT SCOPE_IDENTITY() as new_id")
        return {"machine_id": cursor.fetchone().new_id, "message": "Аппарат успешно создан"}

@app.delete("/machines/{machine_id}")
@auth_required
async def delete_machine(machine_id: int, token: str):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM VendingMachines WHERE MachineID = ?", machine_id)
        conn.commit()
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Аппарат не найден")
    
    return {"message": "Аппарат удален"}

@app.get("/")
def root():
    return {"message": "Vending System API", "status": "active"}

# Инициализация БД
@app.on_event("startup")
async def init_db():
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Создание таблиц
            cursor.execute("""
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
                CREATE TABLE Users (
                    UserID INT PRIMARY KEY IDENTITY,
                    Email NVARCHAR(255) UNIQUE NOT NULL,
                    PasswordHash NVARCHAR(255) NOT NULL,
                    FullName NVARCHAR(255) NOT NULL,
                    Phone NVARCHAR(20),
                    RoleID INT DEFAULT 2,
                    CreatedAt DATETIME DEFAULT GETDATE()
                )
            """)
            
            cursor.execute("""
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='VendingMachines' AND xtype='U')
                CREATE TABLE VendingMachines (
                    MachineID INT PRIMARY KEY IDENTITY,
                    SerialNumber NVARCHAR(100) UNIQUE NOT NULL,
                    InventoryNumber NVARCHAR(100) UNIQUE NOT NULL,
                    Location NVARCHAR(255) NOT NULL,
                    Model NVARCHAR(100) NOT NULL,
                    MachineType NVARCHAR(50) NOT NULL,
                    Manufacturer NVARCHAR(100),
                    ManufactureDate DATE,
                    CommissioningDate DATE,
                    Status NVARCHAR(50) NOT NULL,
                    Country NVARCHAR(50) NOT NULL,
                    TotalIncome DECIMAL(18,2) DEFAULT 0,
                    CompanyID INT DEFAULT 1,
                    CreatedAt DATETIME DEFAULT GETDATE()
                )
            """)
            
            # Создание тестового пользователя
            cursor.execute("SELECT UserID FROM Users WHERE Email = 'admin@vending.com'")
            if not cursor.fetchone():
                cursor.execute("""
                    INSERT INTO Users (Email, PasswordHash, FullName, RoleID) 
                    VALUES (?, ?, 'Администратор', 1)
                """, "admin@vending.com", pwd_context.hash("admin123"))
            
            conn.commit()
        print("✅ База данных инициализирована")
    except Exception as e:
        print(f"❌ Ошибка инициализации БД: {e}"
