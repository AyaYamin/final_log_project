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


    const response =
        http.get(
            "http://localhost:8080/logs?limit=100"
        );


    check(response, {

        "status is 200":
            (r) =>
            r.status === 200,

    });

}