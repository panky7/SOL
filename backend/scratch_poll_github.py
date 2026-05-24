import urllib.request
import json
import time

url = "https://api.github.com/repos/panky7/SOL/actions/runs"

def poll_workflow():
    print("Polling GitHub Actions workflow run status...")
    headers = {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/vnd.github.v3+json'
    }
    
    for i in range(12): # poll for 3 minutes (12 * 15s)
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode('utf-8'))
                runs = data.get('workflow_runs', [])
                if runs:
                    latest_run = runs[0]
                    print(f"Run #{latest_run.get('run_number')}: Event: {latest_run.get('event')}, Status: {latest_run.get('status')}, Conclusion: {latest_run.get('conclusion')}, Url: {latest_run.get('html_url')}")
                    if latest_run.get('status') == 'completed':
                        print("Workflow completed!")
                        break
                else:
                    print("No runs found.")
        except Exception as e:
            print("Error polling workflow:", e)
        time.sleep(15)

if __name__ == "__main__":
    poll_workflow()
