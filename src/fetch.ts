import * as fs from 'fs';

export function fetch(url) {
  if (typeof window !== "undefined") {
    return window.fetch(url).then(r => r.json());
  } else {
    return new Promise((resolve) => {
      fs.readFile(url, 'utf8', (err, data) => {
        if (err) {
          throw err;
        } else {
          resolve( JSON.parse(data) );
        }
      });
    });
  }
}


export function fetchBinary(url) {
  if (typeof window !== "undefined") {
    return window.fetch(url).then(r => r.arrayBuffer());
  } else {
    return new Promise((resolve) => {
      fs.readFile(url, (err, data) => {
        if (err) {
          throw err;
        } else {
          resolve( new Uint8Array(data).buffer );
        }
      });
    });
  }
}

export function fetchImage({url, name}) {
  if (typeof window !== "undefined") {
    return new Promise((resolve, reject) => {
                
      const image = new Image();
      image.onload = () => {
          resolve({
              name,
              image
          });
      };
      image.onerror = err => {
          reject(err);
      };
      image.crossOrigin = 'anonymous';
      // if (source.bufferView !== undefined) {
      //     const bufferView = this.json.bufferViews[source.bufferView];
      //     const buffer = new Uint8Array(this.arrayBuffer[bufferView.buffer], bufferView.byteOffset, bufferView.byteLength);
      //     const blob = new Blob([buffer], { type: source.mimeType });
      //     image.src = URL.createObjectURL(blob);
      // } else if (/base64/.test(source.uri)) {
      //     image.src = url.uri;
      // } else {
          image.src = url;
      // }
    }); 
  } else {
    return new Promise((resolve) => {
      fs.readFile(url, (err, data) => {
        if (err) {
          throw err;
        } else {
          resolve( {
            url,
            name,
            image: new Uint8Array(data).buffer,
          });
        }
      });
    });
  }
}