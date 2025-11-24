import time
import sys
import os
import subprocess
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class AntigravityHandler(FileSystemEventHandler):
    def __init__(self):
        self.last_trigger = 0
        self.debounce_seconds = 5

    def on_modified(self, event):
        if event.is_directory:
            return
        
        # Debounce
        current_time = time.time()
        if current_time - self.last_trigger < self.debounce_seconds:
            return
        self.last_trigger = current_time

        filepath = event.src_path
        filename = os.path.basename(filepath)
        
        print(f"[Watcher] Detected change in: {filename}")
        
        # Routing Logic (Mocking the Meta-Orchestrator decision)
        if filename.endswith('.astro'):
            self.trigger_agent("astro-islands-optimizer", filepath)
        elif filename == "package.json":
            self.trigger_agent("security-auditor", filepath)

    def trigger_agent(self, agent_name, context):
        print(f"[Watcher] ⚡ Dispatching {agent_name} for {context}...")
        # In a real scenario, this would call the Antigravity CLI or API
        # subprocess.run(["antigravity", "run", agent_name, "--context", context])
        print(f"[Watcher] ✅ Agent {agent_name} started (Simulated)")

def start_watcher(path):
    event_handler = AntigravityHandler()
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)
    observer.start()
    print(f"[Watcher] 👁️  Monitoring {path} for State-of-the-Art events...")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    target_path = sys.argv[1] if len(sys.argv) > 1 else "."
    # Ensure watchdog is installed
    try:
        import watchdog
    except ImportError:
        print("Installing required package: watchdog...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "watchdog"])
        
    start_watcher(target_path)
