import { describe, it, expect } from "vitest";
import Fastify from "fastify";

import { logRoutes } from "../../routes.js";


describe("Logs API integration", () => {

    it("POST /logs should insert logs", async () => {

        const app = Fastify();

        await app.register(logRoutes);


        const response = await app.inject({

            method: "POST",

            url: "/logs",

            payload: {

                logs: [
                    {
                        level: "info",
                        message: "integration test",
                        service: "test",
                        timestamp:
                            new Date().toISOString()
                    }
                ]

            }

        });


        expect(response.statusCode)
            .toBe(201);


        const body =
            response.json();


        expect(body.accepted)
            .toBe(1);


        await app.close();

    });



    it("GET /logs should return logs", async () => {


        const app = Fastify();


        await app.register(logRoutes);



        const response =
            await app.inject({

                method: "GET",

                url: "/logs"

            });



        expect(response.statusCode)
            .toBe(200);



        const body =
            response.json();



        expect(body)
            .toHaveProperty("logs");



        await app.close();

    });

});