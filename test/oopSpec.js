define(["sugar-web/oop"], function (oop) {

    describe("oop", function () {

        Person = function (name) {
            this.name = name;
        };

        Person.prototype.sayHi = function () {
            return "Hi! I'm " + this.name;
        };

        Person.prototype.tellMore = function () {};

        SuperHero = function (name, power) {
            Person.call(this, name);
            this.power = power;
        };

        oop.extend(Person, SuperHero);

        SuperHero.prototype.tellMore = function () {
            return Person.prototype.sayHi.call(this) +
                ", and I can " + this.power;
        };

        var bob = new Person("Bob");
        var superman = new SuperHero("Superman", "fly");

        it("should consider instanceof", function () {
            expect(bob instanceof Person).toBe(true);
            expect(superman instanceof Person).toBe(true);
            expect(superman instanceof SuperHero).toBe(true);
        });

        it("should pass parameters to the parent constructor", function () {
            expect(bob.name).toBe("Bob");
            expect(superman.name).toBe("Superman");
        });

        it("should add new propierties", function () {
            expect(bob.power).toBeUndefined();
            expect(superman.power).toBe("fly");
        });

        it("should call parents methods", function () {
            expect(bob.sayHi()).toBe("Hi! I'm Bob");
            expect(superman.sayHi()).toBe("Hi! I'm Superman");
        });

        it("should redefine parents methods", function () {
            expect(bob.tellMore()).toBeUndefined();
            expect(superman.tellMore()).toBe("Hi! I'm Superman, and I can fly");
        });
    });

});
