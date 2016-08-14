class StorageManager {

  constructor(wnd, serializer) {
    this.window = wnd;
    this.serializer = serializer;
    this.isAvailable = null;
  }

  _getStorage() {
    return this.window['localStorage'];
  }

  storageAvailable(type = 'localStorage') {
    if ( this.isAvailable === true )
      return true;

    else if ( this.isAvailable === false )
      return false;

    try {
  		var storage = this.window[type],
  			x = '__storage_test__';
  		storage.setItem(x, x);
  		storage.removeItem(x);

      this.isAvailable = true;
  		return true;
  	}
  	catch(e) {
      this.isAvailable = false;
  		return false;
  	}
  }

  get(key) {
    if (!this.storageAvailable())
      return null;

    return this.serializer.parse( this._getStorage().getItem(key) );
  }

  set(key, obj) {
    if (!this.storageAvailable())
      return false;

    this._getStorage().setItem(key, this.serializer.stringify(obj));
    return true;
  }

  remove(key) {
    if (!this.storageAvailable())
      return false;

    this._getStorage().removeItem(key);
    return true;
  }

}

const storageMngr = new StorageManager(window, JSON);

export default storageMngr;
