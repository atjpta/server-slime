type TimerMap = Map<string, { clear(): void }>;
type Clock = {
    setInterval(fn: () => void, ms: number): { clear(): void };
    setTimeout(fn: () => void, ms: number): { clear(): void };
};

export class TimerService {
    startCountdownTicker<T extends object, K extends keyof T>(
        timers: TimerMap,
        clock: Clock,
        key: string,
        durationMs: number,
        target: T,
        field: K = "timeLeft" as K
    ) {
        this.clearTimer(timers, key);
        (target[field] as number) = durationMs / 1000;
        timers.set(
            key,
            clock.setInterval(() => {
                (target[field] as number) -= 1;
                if ((target[field] as number) <= 0) {
                    this.clearTimer(timers, key);
                }
            }, 1000)
        );
    }
    setTimer(timers: TimerMap, clock: Clock, key: string, durationMs: number, fn: () => void) {
        this.clearTimer(timers, key);
        timers.set(key, clock.setTimeout(fn, durationMs));
    }

    clearTimer(timers: TimerMap, key: string | string[]) {
        const keys = Array.isArray(key) ? key : [key];
        keys.forEach((k) => {
            timers.get(k)?.clear();
            timers.delete(k);
        });
    }

    clearAllTimers(timers: TimerMap) {
        timers.forEach((t) => t.clear());
        timers.clear();
    }
}

export const timerService = new TimerService();
