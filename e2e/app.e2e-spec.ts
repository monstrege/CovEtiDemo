import { CovDemoPage } from './app.po';

describe('cov-demo App', () => {
  let page: CovDemoPage;

  beforeEach(() => {
    page = new CovDemoPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
