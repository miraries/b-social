describe('errors', () => {
    it('handles not found errors properly', () => {
        const {notFound} = require("../api/middleware/errorHandle");
    
        const nextMock = jest.fn()
        const resMock = {
            status: jest.fn()
        }
    
        notFound({originalUrl: 'someroute'}, resMock, nextMock);
    
        expect(resMock.status.mock.calls.length).toBe(1)
        expect(resMock.status.mock.calls[0][0]).toBe(404)
        expect(nextMock.mock.calls.length).toBe(1)
        expect(nextMock.mock.calls[0][0].message).toBe('Not found - someroute')
    });
    
    it('handles exceptions in dev properly', () => {
        const {printStack} = require("../api/middleware/errorHandle");
    
        const resMock = {
            status: jest.fn(),
            json: jest.fn()
        }
    
        printStack('custom error', {}, resMock, {});
    
        expect(resMock.status.mock.calls.length).toBe(1)
        expect(resMock.json.mock.calls.length).toBe(1)
    });
})

describe('token revocation', () => {
    it.todo('goes to next on missing authorization header');
    it.todo('parses token');
    it.todo('returns 403 on revoked token');
    it.todo('goes to next if token is not revoked');
})