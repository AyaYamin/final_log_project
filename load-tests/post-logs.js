import http from "k6/http";
import { check } from "k6";


export const options = {

    stages: [
        {
            duration: "10s",
            target: 50,
        },
        {
            duration: "30s",
            target: 50,
        },
        {
            duration: "10s",
            target: 0,
        },
    ],

};


export default function () {


    const payload = JSON.stringify({

        logs: [
            {
                timestamp: new Date().toISOString(),
                level: "info",
                service: "load-test",
                message: "testing ingestion",
                attributes: {
                    test: true
                }
            }
        ]

    });


    const response =
        http.post(
            "http://localhost:8080/logs",
            payload,
            {
                headers: {
                    "Content-Type":
                    "application/json",
                },
            }
        );


    check(response, {

        "status is 200 or 201":
            (r) =>
            r.status === 200 ||
            r.status === 201,

    });


}