beforeEach(() => {
    jest.resetModules();
  });

const setup = (mockOverrides) => {
    return {
        models: {
            user: {
                findAll: () => [{ name: 'user1', id: 1 }, { name: 'user2', id: 2 }],
                findByPk: (userId) => ({ name: 'user1', id: userId, hasFollowers: (user) => false }),
                ...mockOverrides
            }
        }
    }
}

it('should fetch logged-in user profile', () => {
    jest.doMock('../db/index', () => setup())
    const controller = require("../api/controllers/users.controller");
    const user = { name: 'user1' }
    const resMock = {
        json: jest.fn().mockReturnValue(user)
    };

    return controller.profile({ user }, resMock).then(_ => {
        expect(resMock.json.mock.calls.length).toBe(1)
        expect(resMock.json.mock.calls[0][0]).toBe(user)
    });
});

it('should fetch all users', () => {
    jest.doMock('../db/index', () => setup())
    const controller = require("../api/controllers/users.controller");
    const resMock = {
        json: jest.fn()
    };

    return controller.index({}, resMock).then(_ => {
        expect(resMock.json.mock.calls.length).toBe(1);
        expect(resMock.json.mock.calls[0][0]).toStrictEqual([{ name: 'user1', id: 1 }, { name: 'user2', id: 2 }]);
    });
});

describe('follower checks', () => {
    it('should fail if user does not follow logged user', () => {
        jest.doMock('../db/index', () => setup())
        const controller = require("../api/controllers/users.controller");
        const user = { name: 'user1', id: 1 }
        const params = { userId: 2 }
        const resMock = {
            json: jest.fn()
        };
    
        return controller.isFollowing({ user, params }, resMock).then(_ => {
            expect(resMock.json.mock.calls.length).toBe(1);
            expect(resMock.json.mock.calls[0][0]).toStrictEqual({ "isFollowing": false });
        });
    });
    
    it('should fail if user does not exist', () => {
        jest.doMock('../db/index', () => setup({
            findByPk: (userId) => null
        }))
        const controller = require("../api/controllers/users.controller");
    
        const user = { name: 'user1', id: 1 }
        const params = { userId: 1 }
        const resMock = {
            json: jest.fn(),
            status: jest.fn()
        };
    
        return controller.isFollowing({ user, params }, resMock).then(_ => {
            expect(resMock.json.mock.calls.length).toBe(1);
            expect(resMock.status.mock.calls.length).toBe(1);
            expect(resMock.json.mock.calls[0][0]).toStrictEqual({ "error": "No user with that id" });
        });
    });
    
    it('should fail if user followers themselves', () => {
        jest.doMock('../db/index', () => setup())
        const controller = require("../api/controllers/users.controller");
    
        const user = { name: 'user1', id: 1 }
        const params = { userId: 1 }
        const resMock = {
            json: jest.fn(),
            status: jest.fn()
        };
    
        return controller.isFollowing({ user, params }, resMock).then(_ => {
            expect(resMock.json.mock.calls.length).toBe(1);
            expect(resMock.status.mock.calls.length).toBe(1);
            expect(resMock.json.mock.calls[0][0]).toStrictEqual({ "message": "You cannot follow yourself" });
            expect(resMock.status.mock.calls[0][0]).toStrictEqual(409);
        });
    });
})