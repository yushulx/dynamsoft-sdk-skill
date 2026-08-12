import os

try:
    from dynamsoft_capture_vision_bundle import EnumErrorCode, LicenseManager
except ImportError:
    from dynamsoft_barcode_reader_bundle import EnumErrorCode, LicenseManager


LICENSE_HELP = (
    "Set the DYNAMSOFT_LICENSE_KEY environment variable to your Dynamsoft license key. "
    "Public 1-day trial key: fetch the contents of "
    "https://raw.githubusercontent.com/yushulx/cmake-cpp-barcode-qrcode-mrz/main/license-key.txt . "
    "30-day trial: "
    "https://www.dynamsoft.com/customer/license/trialLicense/?product=dcv&package=cross-platform"
)

_LICENSE_READY = False


def ensure_dbr_license():
    global _LICENSE_READY

    if _LICENSE_READY:
        return

    key = os.environ.get("DYNAMSOFT_LICENSE_KEY")
    if not key:
        raise SystemExit("[DBR] No license key configured. " + LICENSE_HELP)

    err, msg = LicenseManager.init_license(key)
    if err not in (EnumErrorCode.EC_OK, EnumErrorCode.EC_LICENSE_CACHE_USED):
        raise SystemExit(f"[DBR] License initialization failed: {msg}")

    _LICENSE_READY = True
