const app = require('../app');

describe('Security - Route Authentication Guard', () => {
  it('should ensure all routes under all mounted routers require authentication', () => {
    const routers = app.router.stack.filter(l => l.name === 'router' && l.handle && l.handle.stack);

    expect(routers.length).toBeGreaterThan(0);

    const unprotected = [];

    routers.forEach((routerLayer, routerIndex) => {
      routerLayer.handle.stack.forEach((layer) => {
        if (layer.route) {
          const path = layer.route.path;
          const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase());
          const middlewares = layer.route.stack.map(s => s.name);
          
          const hasAuth = middlewares.includes('authenticate');
          if (!hasAuth) {
            unprotected.push(`Router #${routerIndex} Route: ${methods.join(',')} ${path}`);
          }
        }
      });
    });

    expect(unprotected).toEqual([]);
  });
});
