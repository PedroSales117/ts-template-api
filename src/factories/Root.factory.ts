import { RootAdapter } from '../configurations/adapters/root.adapter';
import { RootService } from '../services/Root.service';

export class RootServiceFactory {
  static create(): RootService {
    const rootAdapter = new RootAdapter();
    return new RootService(rootAdapter);
  }
}
