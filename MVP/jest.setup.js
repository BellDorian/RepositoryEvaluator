global.console = {
    ...console,
    
    debug: jest.fn(),
    info: jest.fn(),
    warn: ()=>{},
    error: jest.fn(),
  };