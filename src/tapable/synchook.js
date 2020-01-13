class SyncHook {
    constructor(limit = []) {
        this.limit = limit;
        this.tasks = [];
    }

    tap(name, task) {
        this.tasks.push(task);
    }

    call(...args) {
        const param = args.slice(0, this.limit.length);
        this.tasks.forEach(task => task(...param));
    }
}
