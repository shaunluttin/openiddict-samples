import { RouterConfiguration, Router, RouteConfig, NavigationInstruction } from "aurelia-router";
import { RouterConfigurationService } from "../../../src/open-id/router-configuration-service";
import { ClientModel } from "../../../src/open-id/client-model";
import { OpenIdConfiguration } from "../../../src/open-id/open-id-configuration";

describe("the RouterConfigurationService", function () {

    describe("the ConfigureRouter method", function () {

        let routerConfiguration = new RouterConfiguration();
        let router = new Router(null, null);
        let clientModel = new ClientModel();

        let routerConfigurationService: RouterConfigurationService
            = new RouterConfigurationService(clientModel);

        // this test is for learning how to test the router
        it("adds a test route", function (done) {

            let testRoute: RouteConfig = {
                name: "testName1",
                navigationStrategy: (instruction: NavigationInstruction) => { },
                route: "testRoute1",
            };

            routerConfiguration.mapRoute(testRoute);

            router.configure(routerConfiguration).then(function () {
                expect(router.hasRoute("testName1")).toBe(true);
                done();
            });
        });

        describe("the ConfigureRouter method", function () {

            let redirectRouteName: string = "openIdRedirectRoute";
            let postLogoutRedirectRouteName: string = "openIdPostLogoutRedirectRoute";

            let configureRouter: Promise<void>;

            let openIdConfiguration: OpenIdConfiguration = <OpenIdConfiguration>{
                LoginRedirectModuleId: "testLoginRedirect",
                LogoutRedirectModuleId: "testLogoutRedirect",
            };

            let loginRedirectHandler: jasmine.Spy;
            let logoutRedirectHandler: jasmine.Spy;

            beforeEach(function () {
                loginRedirectHandler = jasmine.createSpy("loginRedirectHandler");
                logoutRedirectHandler = jasmine.createSpy("logoutRedirectHandler");

                routerConfigurationService.ConfigureRouter(
                    routerConfiguration,
                    openIdConfiguration,
                    loginRedirectHandler,
                    logoutRedirectHandler);

                configureRouter = router.configure(routerConfiguration);
            });

            it("adds a route for the open id redirect", function (done) {
                configureRouter.then(function () {
                    expect(router.hasRoute(redirectRouteName)).toBe(true);
                    done();
                });
            });

            it("adds the correct route for the open id redirect", function (done) {
                configureRouter.then(function () {
                    let target = router.routes.find((route) => route.name === redirectRouteName);
                    expect(target.route).toBe(clientModel.RedirectPath);
                    done();
                });
            });

            it("adds the correct navigation strategy for the open id redirect", function (done) {
                configureRouter.then(function () {

                    let target = router.routes.find((route) => route.name === redirectRouteName);
                    let instruction: NavigationInstruction = <NavigationInstruction>
                        {
                            config: {},
                        };

                    target.navigationStrategy(instruction);

                    expect(instruction.config.moduleId).toBe(openIdConfiguration.LoginRedirectModuleId);
                    expect(loginRedirectHandler).toHaveBeenCalled();
                    done();
                });
            });

            it("adds a route for the open id post logout redirect", function (done) {
                configureRouter.then(function () {
                    expect(router.hasRoute(postLogoutRedirectRouteName)).toBe(true);
                    done();
                });
            });

            it("adds the correct route for the open id post logout redirect", function (done) {
                configureRouter.then(function () {
                    let target = router.routes.find((route) => route.name === postLogoutRedirectRouteName);
                    expect(target.route).toBe(clientModel.PostLogoutRedirectPath);
                    done();
                });
            });

            it("adds the correct navigation strategy for the open id post logout redirect", function (done) {
                configureRouter.then(function () {

                    let target = router.routes.find((route) => route.name === postLogoutRedirectRouteName);
                    let instruction: NavigationInstruction = <NavigationInstruction>
                        {
                            config: {},
                        };

                    target.navigationStrategy(instruction);

                    expect(instruction.config.moduleId).toBe(openIdConfiguration.LogoutRedirectModuleId);
                    expect(logoutRedirectHandler).toHaveBeenCalled();

                    done();
                });
            });
        });
    });
});

