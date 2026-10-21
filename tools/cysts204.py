# Module 2.04 is maintained directly in brain-cysts*.js/html.
# No original imaging data or shared styles are regenerated.
from pathlib import Path
import subprocess
for f in ("brain-cysts.js","brain-cysts-data.js","brain-cysts-figures.js"):
    subprocess.run(["node","--check",str(Path("app/src/main/assets")/f)],check=True)
subprocess.run(["node","tests/cysts204.mjs"],check=True)
