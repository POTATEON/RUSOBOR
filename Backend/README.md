# РУСОБОР — Backend

Бэкенд для трекера привычек с геймификацией. FastAPI + SQLite.

## Стек

- Python 3.13
- FastAPI
- SQLAlchemy
- SQLite
- Uvicorn

## Структура проекта

```
backend/
├── main.py              # точка входа
├── database.py          # подключение к БД
├── models.py            # таблицы SQLAlchemy
├── schemas.py           # Pydantic схемы
├── requirements.txt     # зависимости
├── rusobor.db           # база данных SQLite
│
├── routers/
│   ├── auth.py          # /auth
│   ├── habits.py        # /habits
│   └── achievements.py  # /achievements
│
└── services/
    └── achievements.py  # логика выдачи достижений
```

## Установка и запуск

```bash
# клонировать репозиторий
git clone https://github.com/your-repo/RUSOBOR.git
cd RUSOBOR/Backend

# создать виртуальное окружение
python -m venv venv

# активировать
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# установить зависимости
pip install -r requirements.txt

# запустить
uvicorn main:app --reload
```

Сервер запустится на `http://localhost:8000`

Документация API: `http://localhost:8000/docs`

## База данных

SQLite файл `rusobor.db` создаётся автоматически при первом запуске.

Таблицы:

| Таблица | Описание |
|---|---|
| users | Пользователи |
| habits | Привычки |
| tags | Теги |
| achievements | Достижения |
| userHabit | Связь пользователь — привычка (streak) |
| userAchievement | Связь пользователь — достижение (progress, isCompleted) |

## Эндпоинты

### Auth `/auth`

| Метод | Путь | Описание |
|---|---|---|
| POST | `/auth/init` | Создать пользователя |
| GET | `/auth/{id}` | Получить пользователя |

### Habits `/habits`

| Метод | Путь | Описание |
|---|---|---|
| GET | `/habits` | Все привычки с пагинацией |
| GET | `/habits/{idUser}/{idHabit}` | Одна привычка пользователя |
| POST | `/habits` | Создать привычку |
| PUT | `/habits/{idUser}/{idHabit}` | Обновить привычку |
| PUT | `/habits/{idUser}/{idHabit}/streak/add` | Увеличить streak |
| PUT | `/habits/{idUser}/{idHabit}/streak/reset` | Сбросить streak |
| DELETE | `/habits/{idUser}/{idHabit}` | Удалить привычку |

### Achievements `/achievements`

| Метод | Путь | Описание |
|---|---|---|
| GET | `/achievements/{idUser}` | Все достижения пользователя |
| GET | `/achievements/{idUser}/{idAchievement}` | Одно достижение |
| PUT | `/achievements/progress` | Обновить прогресс |
| PUT | `/achievements/{idUser}/{idAchievement}/complete` | Выполнить достижение |

## Формат ответа

Все эндпоинты возвращают единый формат:

```json
{
  "result": { },
  "errorList": null,
  "timeGeneral": "0.0012s"
}
```

## Пагинация

Все GET эндпоинты списков поддерживают пагинацию:

```
GET /habits?page=1&sizePage=10
```
