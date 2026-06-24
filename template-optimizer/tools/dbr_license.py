try:
    from dynamsoft_capture_vision_bundle import EnumErrorCode, LicenseManager
except ImportError:
    from dynamsoft_barcode_reader_bundle import EnumErrorCode, LicenseManager


LICENSE_KEY = "YOUR_LICENSE_KEY"

_LICENSE_READY = False


def ensure_dbr_license():
    global _LICENSE_READY

    if _LICENSE_READY:
        return

    err, msg = LicenseManager.init_license(LICENSE_KEY)
    if err not in (EnumErrorCode.EC_OK, EnumErrorCode.EC_LICENSE_CACHE_USED):
        print(f"[DBR] License warning: {msg}")

    _LICENSE_READY = True