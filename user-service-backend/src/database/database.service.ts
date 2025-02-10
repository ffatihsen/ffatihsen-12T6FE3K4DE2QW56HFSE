import { Injectable, OnModuleInit } from '@nestjs/common';
import { createPool, Pool } from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private  pool: Pool;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    try {
      await this.initializeDatabase();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
    }
  }

  private async initializeDatabase() {
    const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, CONNECTION_LIMIT } = this.getDatabaseConfig();

    // İlk olarak database yoksa oluştur
    const tempPool = await createPool({ host: DB_HOST, user: DB_USER, password: DB_PASSWORD, connectionLimit: CONNECTION_LIMIT });
    await tempPool.execute(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await tempPool.end();

    // Pool'u database ile oluştur
    this.pool = await createPool({ host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME, connectionLimit: CONNECTION_LIMIT });

    // Tabloları oluştur
    await this.createUsersTable();
    await this.insertMockData();
  }

  private getDatabaseConfig() {
    return {
      DB_HOST: this.configService.get<string>('DB_HOST', 'localhost'),
      DB_USER: this.configService.get<string>('DB_USER', 'root'),
      DB_PASSWORD: this.configService.get<string>('DB_PASSWORD', ''),
      DB_NAME: this.configService.get<string>('DB_NAME', 'test_db'),
      CONNECTION_LIMIT: this.configService.get<number>('CONNECTION_LIMIT', 10),
    };
  }

  private async createUsersTable() {
    try {
      await this.pool.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          surname VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          age INT CHECK (age > 0),
          country VARCHAR(255),
          district VARCHAR(255),
          role ENUM('user', 'admin') DEFAULT 'user',
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('Users table is ready.');
    } catch (error) {
      console.error('Failed to create users table:', error);
    }
  }

  private async insertMockData() {
    try {
      const [rows]: any = await this.pool.query('SELECT COUNT(*) as count FROM users');
      if (rows[0].count > 0) {
        console.log('Mock data already exists, skipping insertion.');
        return;
      }

      const mockUsers = await Promise.all(
        _.times(5, async () => ({
          name: _.capitalize(_.sample(['Mach', 'John', 'Marcus', 'Emily', 'Alice'])),
          surname: _.capitalize(_.sample(['Ironman', 'Leen', 'Leon', 'Smith', 'Brown'])),
          email: `${_.random(1000, 9999)}@example.com`,
          password: await bcrypt.hash('password123', 10),
          phone: `05${_.random(100000000, 999999999)}`,
          age: _.random(20, 60),
          country: _.sample(['USA', 'UK', 'Germany', 'France', 'Turkey']),
          district: _.sample(['New York', 'London', 'Berlin', 'Paris', 'Istanbul']),
          role: _.sample(['user', 'admin']),
        }))
      );

      const query = `
        INSERT INTO users (name, surname, email, password, phone, age, country, district, role)
        VALUES ${mockUsers.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ')}
      `;

      const values = mockUsers.flatMap(user => Object.values(user));

      await this.pool.execute(query, values);
      console.log('Mock users inserted successfully');
    } catch (error) {
      console.error('Failed to insert mock data:', error);
    }
  }

  getPool(): Pool {
    return this.pool;
  }
}
