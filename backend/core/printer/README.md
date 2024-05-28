# Change IP address of the printer

## Open an interactive shell

```bash
python3 manage.py shell
```

## Change IP address

```python
from core.models.printer import Printer

p = Printer.objects.get(id=1)
p.ip_address = "<new_ip_address>"
p.save()
```

Remember also to change the seed, if needed.
