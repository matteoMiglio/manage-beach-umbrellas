from escpos.printer import Network, Dummy
from escpos.exceptions import DeviceNotFoundError
from datetime import datetime
import os
import pytz

ip = "192.168.1.100"
try:
    printer_network = Network(ip, timeout=2)
    printer_network.open()
    printer_network.close()
except DeviceNotFoundError:
    print("Printer not found")

print(printer_network.is_online())

dummy = Dummy()

# LOGO
dummy.set(align='center', width=1, height=1)
dummy.text("\nPROVA PROVA\n")

dummy.cut()

printer_network._raw(dummy.output)