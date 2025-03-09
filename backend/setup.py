from setuptools import setup, find_packages

setup(
    name="campy",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi>=0.104.0",
        "uvicorn>=0.24.0",
        "sqlalchemy>=2.0.0",
        "alembic>=1.13.0",
        "asyncpg>=0.30.0",
        "python-dotenv>=1.0.0",
    ],
) 