# Load Test Results

## Environment

- Tool: k6
- Virtual Users: 50
- Duration: 50 seconds
- Database: PostgreSQL

---

# POST /logs

Requests: 11752

Throughput:
234.99 req/s

Failure rate:
0%

Average latency:
169.97 ms

p95:
312.42 ms


---

# GET /logs

Requests:
7781

Throughput:
155.63 req/s

Failure rate:
0%

Average latency:
257.69 ms

p95:
494.76 ms


---

# GET /logs/aggregate

Requests:
7660

Throughput:
153.21 req/s

Failure rate:
0%

Average latency:
262.09 ms

p95:
656.9 ms


---

# Conclusion

The logging service successfully handled concurrent traffic with 50 virtual users.

All tested endpoints returned successful responses with zero failures.