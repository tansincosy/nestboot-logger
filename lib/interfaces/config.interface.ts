export interface ConfigService {
  get<T>(key: string, defaultVal?: any): T;
}
