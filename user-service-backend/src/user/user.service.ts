import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';
import * as mysql from 'mysql2';
import * as _ from 'lodash';
import { handleDatabaseError } from '../common/utils/error-handler';
import { ResultSetHeader } from 'mysql2';

@Injectable()
export class UserService {
  constructor(private readonly dbService: DatabaseService) {}


  async getUsers(page: number, pageSize: number, search?: string) {
    const offset = (page - 1) * pageSize;
  
    const query = `SELECT id, name, surname, email FROM users`;
    const [rows] = await this.dbService.getPool().execute(query);
  
    let users = rows as any[];
  
    if (search) {
      users = _.filter(users, user =>
        _.some([user.name, user.surname], field =>
          _.toLower(field).includes(_.toLower(search))
        )
      );
    }
  
    const paginatedUsers = _.slice(users, offset, offset + pageSize);
  
    const totalPages = Math.ceil(users.length / pageSize);
  
    return {
      users: paginatedUsers,
      totalRecords: users.length,
      totalPages,
      currentPage: page,
      pageSize,
    };
  }



async getUserById(id: number) {
  const query = 'SELECT id,name,surname,email,phone,age,country,district,role,createdAt,updatedAt  FROM users WHERE id = ?';

  try {
    const [rows] = await this.dbService.getPool().execute(query, [id]);
    return rows[0] || null;
  } catch (error) {
    handleDatabaseError(error);
  }
}


  async createUser(userData) {
    const hash = await bcrypt.hash(userData.password, 10);
    const { name, surname, email, phone, age, country, district, role = 'user' } = userData;

    const query = `
      INSERT INTO users (name, surname, email, password, phone, age, country, district, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const params = [
      mysql.escape(name).slice(1, -1),
      mysql.escape(surname).slice(1, -1),
      mysql.escape(email).slice(1, -1),
      mysql.escape(hash).slice(1, -1),
      mysql.escape(phone).slice(1, -1),
      age ? parseInt(age, 10) : null,
      mysql.escape(country).slice(1, -1),
      mysql.escape(district).slice(1, -1),
      mysql.escape(role).slice(1, -1),
    ];
    
    try {
      const [result] = await this.dbService.getPool().execute(query, params);
      const insertId = (result as ResultSetHeader).insertId;

      return { id: insertId };
    } catch (error) {
      handleDatabaseError(error);
    }
  }


async updateUser(id: number, userData: Record<string, any>) {
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }

  const updates = Object.entries(userData)
    .map(([key]) => `${key} = ?`)
    .join(', ');

  if (!updates) {
    return { message: 'No fields to update' };
  }

  const values = Object.entries(userData).map(([key, value]) => {
    if (key === 'age' && typeof value === 'string' && value.trim() !== '') {
      return parseInt(value, 10);
    }
    return value;
  });

  values.push(id);

  const query = `UPDATE users SET ${updates} WHERE id = ?`;

  try {
    await this.dbService.getPool().execute(query, values);
    return { message: 'User updated successfully' };
  } catch (error) {
    handleDatabaseError(error);
  }
}


}
