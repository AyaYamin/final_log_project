import { describe, it, expect, beforeEach } from "vitest";
import { LogsRepository } from "../repository.js";
import { db } from "../../../db/index.js";
import { logs } from "../../../db/schema.js";


describe("LogsRepository", () => {

    const repository = new LogsRepository();


    beforeEach(async () => {

        await db
            .delete(logs);

    });


    describe("find", () => {

    it("should filter logs by service", async () => {

        await repository.insertMany([
            {
                timestamp: new Date(),
                level: "info",
                service: "auth",
                message: "login success",
                attributes: {}
            },
            {
                timestamp: new Date(),
                level: "error",
                service: "payment",
                message: "payment failed",
                attributes: {}
            }
        ]);


        const result =
            await repository.find({
                limit: 10,
                attributes: {},
                service: "auth"
            });


        expect(result.rows.length)
            .toBe(1);


        expect(result.rows[0].service)
            .toBe("auth");

    });


});


describe("aggregate", () => {

    it("should return log aggregation counts", async () => {


        await repository.insertMany([
            {
                timestamp: new Date(),
                level: "info",
                service: "auth",
                message: "login",
                attributes: {}
            },
            {
                timestamp: new Date(),
                level: "error",
                service: "auth",
                message: "failed login",
                attributes: {}
            },
            {
                timestamp: new Date(),
                level: "warn",
                service: "payment",
                message: "slow payment",
                attributes: {}
            }
        ]);



        const result =
            await repository.aggregate();



        expect(result.total)
            .toBe(3);



        expect(result.byLevel.info)
            .toBe(1);


        expect(result.byLevel.error)
            .toBe(1);


        expect(result.byLevel.warn)
            .toBe(1);



        expect(result.byService.auth)
            .toBe(2);


        expect(result.byService.payment)
            .toBe(1);


    });

});


describe("deleteOlderThan", () => {

    it("should delete logs older than given date", async () => {


        const oldDate = new Date();

        oldDate.setDate(
            oldDate.getDate() - 10
        );


        const newDate = new Date();



        await repository.insertMany([
            {
                timestamp: oldDate,
                level: "error",
                service: "auth",
                message: "old log",
                attributes: {}
            },
            {
                timestamp: newDate,
                level: "info",
                service: "api",
                message: "new log",
                attributes: {}
            }
        ]);



        const deleted =
            await repository.deleteOlderThan(
                new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
            );



        expect(deleted)
            .toBe(1);



        const remaining =
            await repository.find({
                limit: 10,
                attributes: {}
            });



        expect(
            remaining.rows.length
        )
        .toBe(1);



        expect(
            remaining.rows[0].message
        )
        .toBe("new log");


    });

});


    describe("insertMany", () => {


        it("should insert logs", async () => {


            await repository.insertMany([
                {
                    timestamp: new Date(),
                    level: "info",
                    service: "api",
                    message: "test log",
                    attributes: {}
                }
            ]);


            const result =
                await repository.find({
                    limit: 10,
                    attributes: {}
                });


            expect(result.rows.length)
                .toBe(1);


            expect(result.rows[0].message)
                .toBe("test log");

        });


    });

});