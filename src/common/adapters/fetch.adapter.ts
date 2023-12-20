import { HttpAdapter } from '../interfaces/http-adapter.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FetchAdapter implements HttpAdapter {
  private fetchFunc = fetch;
  async get<T>(url: string): Promise<T> {
    try {
      const data = await this.fetchFunc(url);
      const dataJSON = await data.json();
      return dataJSON;
    } catch (error) {
      throw new Error('Error occurred while fetching data - Check logs');
    }
  }
}
