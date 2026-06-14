package com.example.demo

import io.micrometer.core.instrument.Counter
import io.micrometer.core.instrument.MeterRegistry
import io.micrometer.core.instrument.Timer
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import java.time.Instant
import kotlin.math.min

@RestController
class ObservabilityDemoController(
    registry: MeterRegistry
) {
    private val observedRequests: Counter =
        Counter.builder("demo_observed_requests_total")
            .description("Total number of demo observability requests")
            .register(registry)

    private val forcedErrors: Counter =
        Counter.builder("demo_forced_errors_total")
            .description("Total number of forced demo errors")
            .register(registry)

    private val latencyTimer: Timer =
        Timer.builder("demo_observed_request_duration_seconds")
            .description("Duration of demo observability requests")
            .publishPercentileHistogram()
            .register(registry)

    /*
    endpoint used only for testing for generating programmatically failures inside the
    applications. used by k6.
     */
    @GetMapping("/api/demo/observe")
    fun observe(
        @RequestParam(defaultValue = "0") delayMs: Long,
        @RequestParam(defaultValue = "false") fail: Boolean
    ): Map<String, Any> {
        observedRequests.increment()

        return latencyTimer.recordCallable {
            val boundedDelay = min(delayMs, 2_000)

            if (boundedDelay > 0) {
                Thread.sleep(boundedDelay)
            }

            if (fail) {
                forcedErrors.increment()
                throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Forced demo failure")
            }

            mapOf(
                "status" to "ok",
                "delayMs" to boundedDelay,
                "timestamp" to Instant.now().toString()
            )
        }!!
    }
}
