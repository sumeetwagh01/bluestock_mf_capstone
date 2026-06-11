"""
run_pipeline.py
Master ETL execution script — Bluestock MF Capstone
Run: python scripts/run_pipeline.py
"""
import subprocess
import sys
from pathlib import Path
from datetime import datetime

def run_step(step_name, script_path):
    print(f"\n{'='*55}")
    print(f"▶ {step_name}")
    print(f"{'='*55}")
    result = subprocess.run(
        [sys.executable, script_path],
        capture_output=False
    )
    if result.returncode == 0:
        print(f"{step_name} complete")
    else:
        print(f" {step_name} FAILED")
    return result.returncode

if __name__ == "__main__":
    start = datetime.now()
    print(f"\n Bluestock MF ETL Pipeline")
    print(f"   Started: {start.strftime('%Y-%m-%d %H:%M:%S')}")

    steps = [
        ("Step 1: Fetch Live NAV",    "scripts/live_nav_fetch.py"),
        ("Step 2: Load to SQLite",    "scripts/load_to_sqlite.py"),
    ]

    errors = 0
    for name, path in steps:
        code = run_step(name, path)
        if code != 0:
            errors += 1

    end = datetime.now()
    elapsed = (end - start).seconds

    print(f"\n{'='*55}")
    print(f"Pipeline complete in {elapsed}s")
    print(f"Errors: {errors}")
    print(f"{'='*55}\n")