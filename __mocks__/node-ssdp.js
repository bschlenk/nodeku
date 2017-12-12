/* eslint-env jest */

const ssdp = jest.genMockFromModule('node-ssdp');

let headers = null;

class Client {
  /**
   * Construct a mock ssdp client.
   * @param {boolean} override Whether to triger events.
   */
  constructor() {
    this.searched = null;
    this.events = {};
  }

  /**
   * Mock .search()
   * @param {string} serviceType 'ssdp:all'
   */
  search(query) {
    this.searched = query;
    if (headers) {
      setImmediate(() => {
        const { response } = this.events;
        if (response) {
          response(headers);
        }
      });
    }
  }

  /**
   * Mock .on() event listener method
   * @param {string}   eventName 'response'
   * @param {function} callback pass data back to callee
   * @return {{ SERVER: string, LOCATION: string }}
   */
  on(event, fn) {
    this.events[event] = fn;
  }

  // eslint-disable-next-line
  stop() {}
}

ssdp.Client = Client;

// eslint-disable-next-line no-underscore-dangle
ssdp.__setHeaders = function __setHeaders(h) {
  headers = h;
};

module.exports = ssdp;
