export interface ConfigService {
  get(key: string, defaultVal?: any): string;
}
