
// @flow
import { mergeDeepRight } from 'ramda'

type ApiError = {
  error: string,
  message?: string,
  _resp?: any
}

export const Error = {
  Unauthorized: 'invalid_credentials',
  Network: 'network_error',
  Timeout: 'timeout_error',
  Internal: 'internal_error',
  Unavailable: 'service_unavailable_error',
  Unknown: 'unknown_error'
}

const respStatusToError: Object = {
  '401': Error.Unauthorized,
  '408': Error.Timeout,
  '500': Error.Internal,
  '503': Error.Unavailable
}

function getResponseError(resp: Object): ApiError {
  let err = respStatusToError[resp.code]
  if (err === undefined) {
    return {
      error: Error.Unknown
    }
  }
  return {
    error: err,
    //message: resp.detail,
    _resp: resp
  }
}

function timeoutPromise(timeout: number, promise: Promise<*>): Promise<*> {
  return new Promise((resolve, reject) => {
    promise.then(resolve, reject)
    setTimeout((_resp?: Object)=>{
      reject({ error: Error.Timeout, message: 'request_timeout', _resp });
    }, timeout)
  });
}

const autobind = self => {
  for (const key of Object.getOwnPropertyNames(self.constructor.prototype)) {
    // $FlowExpectedError
    const val = self[key];
    if (key !== 'constructor' && typeof val === 'function') {
      // $FlowExpectedError
      self[key] = val.bind(self);
    }
  }
  return self;
}

class Client {
  scheme: string
  host: string
  timeout: number
  authHeader: Object | null
  urlPrefix: string

  constructor(scheme?: string, host?: string, timeout?: number, authHeader?: Object) {
    this.scheme = scheme || 'http'
    this.host = host || 'localhost:9099'
    this.timeout = timeout || 20000
    this.authHeader = authHeader || null
    this.urlPrefix = this.scheme + '://' + this.host;

    autobind(this)
  }

  setAuthHeader(hdr: Object) {
    this.authHeader = hdr
  }

  resetAuthHeader() {
    this.authHeader = null
  }

  request(path: string, config?: Object): Promise<Object|ApiError> {
    let cfg = {
      timeout: this.timeout,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    tron.log("before config check")
    if (config) {
      cfg = mergeDeepRight(cfg, config);
      if (config.data) {
        config.body = JSON.stringify(config.data);
        config.data = undefined;
      }
    }
    if (this.authHeader) {
      Object.assign(cfg.headers, this.authHeader)
    }
    let url = this.urlPrefix + path
    let reqp = new Promise((resolve, reject)=>{
      fetch(url, cfg).then(resolve).catch((resp)=>{
        reject(getResponseError(resp))
      })
    })
    return timeoutPromise(cfg.timeout, reqp)
  }



  
  createAircraftPath() {
    return '/aircrafts'
  }


  // Create aircraft
  // data contains the action payload (request body)
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	createAircraft(path: string, data: AircraftForm, config?: Object) {
    let cfg = {
      method: 'post',
      data: data,

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  createDropzonePath() {
    return '/dropzones'
  }


  // Create dropzone
  // data contains the action payload (request body)
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	createDropzone(path: string, data: DropzoneForm, config?: Object) {
    let cfg = {
      method: 'post',
      data: data,

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  createGearPath() {
    return '/gears'
  }


  // Create gear
  // data contains the action payload (request body)
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	createGear(path: string, data: GearForm, config?: Object) {
    let cfg = {
      method: 'post',
      data: data,

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  createJumpPath(user_id: number|string) {
    return '/users/'+user_id+'/jumps'
  }


  // Create jump
  // data contains the action payload (request body)
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	createJump(path: string, data: JumpForm, config?: Object) {
    let cfg = {
      method: 'post',
      data: data,

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  createJump_groupPath() {
    return '/jump_groups'
  }


  // Create jump_group
  // data contains the action payload (request body)
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	createJump_group(path: string, data: JumpGroupForm, config?: Object) {
    let cfg = {
      method: 'post',
      data: data,

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  createManufacturerPath() {
    return '/manufacturers'
  }


  // Create manufacturer
  // data contains the action payload (request body)
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	createManufacturer(path: string, data: ManufacturerForm, config?: Object) {
    let cfg = {
      method: 'post',
      data: data,

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  createUser_gearPath(user_id: number|string) {
    return '/users/'+user_id+'/gear'
  }


  // Create gear
  // data contains the action payload (request body)
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	createUser_gear(path: string, data: UserGearForm, config?: Object) {
    let cfg = {
      method: 'post',
      data: data,

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  indexAircraftPath() {
    return '/aircrafts'
  }


  // List aircrafts
  // limit: number, name: string, offset: number, view: string are used to build the request query string.
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	indexAircraft(path: string, limit: number, name: string, offset: number, view: string, config?: Object) {
    let cfg = {
      method: 'get',

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  indexDropzonePath() {
    return '/dropzones'
  }


  // List dropzones
  // limit: number, name: string, offset: number, view: string are used to build the request query string.
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	indexDropzone(path: string, limit: number, name: string, offset: number, view: string, config?: Object) {
    let cfg = {
      method: 'get',

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  indexGearPath() {
    return '/gears'
  }


  // List gears
  // limit: number, manufacturer_id: number, name: string, offset: number, view: string are used to build the request query string.
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	indexGear(path: string, limit: number, manufacturer_id: number, name: string, offset: number, view: string, config?: Object) {
    let cfg = {
      method: 'get',

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  indexJumpPath(user_id: number|string) {
    return '/users/'+user_id+'/jumps'
  }


  // List jumps
  // limit: number, offset: number, view: string are used to build the request query string.
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	indexJump(path: string, limit: number, offset: number, view: string, config?: Object) {
    let cfg = {
      method: 'get',

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  indexJump_groupPath() {
    return '/jump_groups'
  }


  // List jump_groups
  // limit: number, offset: number, view: string are used to build the request query string.
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	indexJump_group(path: string, limit: number, offset: number, view: string, config?: Object) {
    let cfg = {
      method: 'get',

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  indexLocationPath() {
    return '/locations'
  }


  // List locations
  // limit: number, offset: number, view: string are used to build the request query string.
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	indexLocation(path: string, limit: number, offset: number, view: string, config?: Object) {
    let cfg = {
      method: 'get',

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  indexManufacturerPath() {
    return '/manufacturers'
  }


  // List manufacturers
  // limit: number, name: string, offset: number, view: string are used to build the request query string.
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	indexManufacturer(path: string, limit: number, name: string, offset: number, view: string, config?: Object) {
    let cfg = {
      method: 'get',

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  indexUserPath() {
    return '/users'
  }


  // List users
  // country: string, licence: string, limit: number, name: string, offset: number, view: string are used to build the request query string.
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	indexUser(path: string, country: string, licence: string, limit: number, name: string, offset: number, view: string, config?: Object) {
    let cfg = {
      method: 'get',

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  indexUser_gearPath(user_id: number|string) {
    return '/users/'+user_id+'/gear'
  }


  // List gear
  // limit: number, name: string, offset: number, view: string are used to build the request query string.
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	indexUser_gear(path: string, limit: number, name: string, offset: number, view: string, config?: Object) {
    let cfg = {
      method: 'get',

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  loginAuthPath() {
    return '/auth/login'
  }


  // Creates a valid JWT
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	loginAuth(path: string, config?: Object) {
    let cfg = {
      method: 'post',

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  meUserPath() {
    return '/users/_me'
  }


  // Show current user
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	meUser(path: string, config?: Object) {
    let cfg = {
      method: 'get',

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  registerAuthPath() {
    return '/auth/register'
  }


  // Registers user and creates a valid JWT
  // data contains the action payload (request body)
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	registerAuth(path: string, data: RegisterPayload, config?: Object) {
    let cfg = {
      method: 'post',
      data: data,

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  showAircraftPath(aircraft_id: number|string) {
    return '/aircrafts/'+aircraft_id+''
  }


  // List aircrafts
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	showAircraft(path: string, config?: Object) {
    let cfg = {
      method: 'get',

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  showDropzonePath(dropzone_id: number|string) {
    return '/dropzones/'+dropzone_id+''
  }


  // List dropzones
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	showDropzone(path: string, config?: Object) {
    let cfg = {
      method: 'get',

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  showGearPath(gear_id: number|string) {
    return '/gears/'+gear_id+''
  }


  // List gears
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	showGear(path: string, config?: Object) {
    let cfg = {
      method: 'get',

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  showJumpPath(user_id: number|string, jump_id: number|string) {
    return '/users/'+user_id+'/jumps/'+jump_id+''
  }


  // List jumps
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	showJump(path: string, config?: Object) {
    let cfg = {
      method: 'get',

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  showJump_groupPath(jump_group_id: number|string) {
    return '/jump_groups/'+jump_group_id+''
  }


  // List jump_groups
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	showJump_group(path: string, config?: Object) {
    let cfg = {
      method: 'get',

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  showLocationPath(location_id: number|string) {
    return '/locations/'+location_id+''
  }


  // List locations
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	showLocation(path: string, config?: Object) {
    let cfg = {
      method: 'get',

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  showManufacturerPath(manufacturer_id: number|string) {
    return '/manufacturers/'+manufacturer_id+''
  }


  // List manufacturers
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	showManufacturer(path: string, config?: Object) {
    let cfg = {
      method: 'get',

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  showUserPath(user_id: number|string) {
    return '/users/'+user_id+''
  }


  // Show user
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	showUser(path: string, config?: Object) {
    let cfg = {
      method: 'get',

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  showUser_gearPath(user_id: number|string, gear_id: number|string) {
    return '/users/'+user_id+'/gear/'+gear_id+''
  }


  // List gear
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	showUser_gear(path: string, config?: Object) {
    let cfg = {
      method: 'get',

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  statusApi_statusPath() {
    return '/'
  }


  // Shows api status
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	statusApi_status(path: string, config?: Object) {
    let cfg = {
      method: 'get',

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  updateAircraftPath(aircraft_id: number|string) {
    return '/aircrafts/'+aircraft_id+''
  }


  // Update aircraft
  // data contains the action payload (request body)
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	updateAircraft(path: string, data: AircraftUpdateForm, config?: Object) {
    let cfg = {
      method: 'patch',
      data: data,

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  updateDropzonePath(dropzone_id: number|string) {
    return '/dropzones/'+dropzone_id+''
  }


  // Update dropzone
  // data contains the action payload (request body)
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	updateDropzone(path: string, data: DropzoneUpdateForm, config?: Object) {
    let cfg = {
      method: 'patch',
      data: data,

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  updateGearPath(gear_id: number|string) {
    return '/gears/'+gear_id+''
  }


  // Update gear
  // data contains the action payload (request body)
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	updateGear(path: string, data: GearUpdateForm, config?: Object) {
    let cfg = {
      method: 'patch',
      data: data,

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  updateJumpPath(user_id: number|string, jump_id: number|string) {
    return '/users/'+user_id+'/jumps/'+jump_id+''
  }


  // Update jump
  // data contains the action payload (request body)
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	updateJump(path: string, data: JumpUpdateForm, config?: Object) {
    let cfg = {
      method: 'patch',
      data: data,

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  updateJump_groupPath(jump_group_id: number|string) {
    return '/jump_groups/'+jump_group_id+''
  }


  // Update jump_group
  // data contains the action payload (request body)
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	updateJump_group(path: string, data: JumpGroupForm, config?: Object) {
    let cfg = {
      method: 'patch',
      data: data,

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  updateManufacturerPath(manufacturer_id: number|string) {
    return '/manufacturers/'+manufacturer_id+''
  }


  // Update manufacturer
  // data contains the action payload (request body)
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	updateManufacturer(path: string, data: ManufacturerUpdateForm, config?: Object) {
    let cfg = {
      method: 'patch',
      data: data,

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  updateUserPath(user_id: number|string) {
    return '/users/'+user_id+''
  }


  // Update user
  // data contains the action payload (request body)
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	updateUser(path: string, data: UserUpdatePayload, config?: Object) {
    let cfg = {
      method: 'patch',
      data: data,

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }




  
  updateUser_gearPath(user_id: number|string, gear_id: number|string) {
    return '/users/'+user_id+'/gear/'+gear_id+''
  }


  // Update gear
  // data contains the action payload (request body)
  // config is an optional object to be merged into the config built by the function prior to making the request.
  // The content of the config object is described here: https://github.com/mzabriskie/axios#request-api
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
	updateUser_gear(path: string, data: GearUpdateForm, config?: Object) {
    let cfg = {
      method: 'patch',
      data: data,

    }
    if (config) {
      Object.assign(cfg, config);
    }
    return this.request(path, cfg)
  }

}

// Error response media type (default view)
// Identifier: application/vnd.goa.error; view=default
type error =  {
	// an application-specific error code, expressed as a string value.
	code: string,
	// a human-readable explanation specific to this occurrence of the problem.
	detail: string,
	// a unique identifier for this particular occurrence of the problem.
	id: string,
	// a meta object containing non-standard meta-information about the error.
	meta: {[string]: any},
	// the HTTP status code applicable to this problem, expressed as a string value.
	status: string,
}
// APIStatus media type (default view)
// Identifier: application/json; view=default
type APIStatus =  {
	// Status of API
	status: string,
}
// Aircraft info (default view)
// Identifier: application/vnd.fallkeeper.aircraft+json; view=default
type AircraftMedia =  {
	// AvgCeiling an average altitude of the plane ever tracked by fallkeeper
	avg_ceiling: number,
	// Capacity is maximum number of passengers
	capacity: number,
	// Count of registered units
	count: number,
	description: string,
	id: number,
	image: string,
	// MaxCeilingTracked is a maximum altitude of the plane ever tracked by fallkeeper
	max_ceiling_tracked: number,
	name: string,
	// RateOfClimb in m/s
	rate_of_climb: number,
	// ServiceSeiling is a maximum altitude in meters
	service_ceiling: number,
	// UsefulLoad in kg
	useful_load: number,
}
// Aircraft info (link view)
// Identifier: application/vnd.fallkeeper.aircraft+json; view=link
type AircraftMediaLink =  {
	href: string,
	image: string,
	name: string,
}
// AircraftMediaCollection is the media type for an array of AircraftMedia (default view)
// Identifier: application/vnd.fallkeeper.aircraft+json; type=collection; view=default
type AircraftMediaCollection = Array<AircraftMedia>
// AircraftMediaCollection is the media type for an array of AircraftMedia (link view)
// Identifier: application/vnd.fallkeeper.aircraft+json; type=collection; view=link
type AircraftMediaLinkCollection = Array<AircraftMediaLink>
// FormErrors media type (default view)
// Identifier: application/vnd.fallkeeper.badform+json; view=default
type FormErrors =  {
	// array of invlalid fields
	fields: Array<FieldErrors>,
}
// Dropzone info (default view)
// Identifier: application/vnd.fallkeeper.dropzone+json; view=default
type DropzoneMedia =  {
	aircrafts: AircraftMediaCollection,
	// Description of dropzone
	description: string,
	id: number,
	// JumpsTracked totally by all skydivers on this dropzone
	jumps_tracked: number,
	// Links to related resources
	links: DropzoneMediaLinks,
	// Location of DZ
	location: LocationMedia,
	// Name of dropzone
	name: string,
	// Rating by user
	rating: number,
	ratings_count: number,
	// Type of dropzone
	type: string,
}
// Dropzone info (link view)
// Identifier: application/vnd.fallkeeper.dropzone+json; view=link
type DropzoneMediaLink =  {
	// Href is a link to this location
	href: string,
	id: number,
	// Links to related resources
	links: DropzoneMediaLinks,
	// Name of dropzone
	name: string,
	// Type of dropzone
	type: string,
}
// DropzoneMediaLinks contains links to related resources of DropzoneMedia.
type DropzoneMediaLinks =  {
	aircrafts: AircraftMediaLinkCollection,
	location: LocationMediaLink,
}
// DropzoneMediaCollection is the media type for an array of DropzoneMedia (default view)
// Identifier: application/vnd.fallkeeper.dropzone+json; type=collection; view=default
type DropzoneMediaCollection = Array<DropzoneMedia>
// DropzoneMediaCollection is the media type for an array of DropzoneMedia (link view)
// Identifier: application/vnd.fallkeeper.dropzone+json; type=collection; view=link
type DropzoneMediaLinkCollection = Array<DropzoneMediaLink>
// DropzoneMediaLinksArray contains links to related resources of DropzoneMediaCollection.
type DropzoneMediaLinksArray = Array<DropzoneMediaLinks>
// Gear info (default view)
// Identifier: application/vnd.fallkeeper.gear+json; view=default
type GearMedia =  {
	// Description of gear
	description: string,
	href: string,
	id: number,
	// Image
	image: string,
	// Links to related resources
	links: GearMediaLinks,
	// Name of gear (e.g. `Fire 2`)
	name: string,
	// Type of gear
	type: number,
}
// Gear info (link view)
// Identifier: application/vnd.fallkeeper.gear+json; view=link
type GearMediaLink =  {
	href: string,
	// Image
	image: string,
	// Name of gear (e.g. `Fire 2`)
	name: string,
	// Type of gear
	type: number,
}
// GearMediaLinks contains links to related resources of GearMedia.
type GearMediaLinks =  {
	manufacturer: ManufacturerMediaLink,
}
// GearMediaCollection is the media type for an array of GearMedia (default view)
// Identifier: application/vnd.fallkeeper.gear+json; type=collection; view=default
type GearMediaCollection = Array<GearMedia>
// GearMediaCollection is the media type for an array of GearMedia (link view)
// Identifier: application/vnd.fallkeeper.gear+json; type=collection; view=link
type GearMediaLinkCollection = Array<GearMediaLink>
// GearMediaLinksArray contains links to related resources of GearMediaCollection.
type GearMediaLinksArray = Array<GearMediaLinks>
// Skydive jump info (default view)
// Identifier: application/vnd.fallkeeper.jump+json; view=default
type JumpMedia =  {
	// Altitude over ground
	altitude: number,
	// DeploymentAltitude is altitude of parachute deployment in meters
	deployment_altitude: number,
	// DeploymentAt timestamp
	deployment_at: string,
	// FreefallDuration in seconds
	freefall_duration: number,
	// FreefallStartedAt timestamp
	freefall_started_at: string,
	id: number,
	// Kind of jump (skydive|base)
	kind: string,
	// LandedAt timestamp
	landed_at: string,
	// Links to related resources
	links: JumpMediaLinks,
	// Maximum vertical veolocity in m/s
	max_vertical_velocity: number,
	// Type of jump (wingsuit, freefly, rw...)
	type: string,
}
// Skydive jump info (link view)
// Identifier: application/vnd.fallkeeper.jump+json; view=link
type JumpMediaLink =  {
	// Altitude over ground
	altitude: number,
	// FreefallStartedAt timestamp
	freefall_started_at: string,
	href: string,
	id: number,
	// Kind of jump (skydive|base)
	kind: string,
	// Type of jump (wingsuit, freefly, rw...)
	type: string,
}
// JumpMediaLinks contains links to related resources of JumpMedia.
type JumpMediaLinks =  {
	dropzone: DropzoneMediaLink,
	gear: UserGearMediaLink,
	jump_group: JumpGroupMediaLink,
	user: UserMediaLink,
}
// JumpMediaCollection is the media type for an array of JumpMedia (default view)
// Identifier: application/vnd.fallkeeper.jump+json; type=collection; view=default
type JumpMediaCollection = Array<JumpMedia>
// JumpMediaCollection is the media type for an array of JumpMedia (link view)
// Identifier: application/vnd.fallkeeper.jump+json; type=collection; view=link
type JumpMediaLinkCollection = Array<JumpMediaLink>
// JumpMediaLinksArray contains links to related resources of JumpMediaCollection.
type JumpMediaLinksArray = Array<JumpMediaLinks>
// Jump group info (default view)
// Identifier: application/vnd.fallkeeper.jump_group+json; view=default
type JumpGroupMedia =  {
	id: number,
	// LiftOffAt is a time when aircraft lifted off the ground
	lift_off_at: string,
	// Links to related resources
	links: JumpGroupMediaLinks,
	// Size of group (number of people)
	size: number,
}
// Jump group info (link view)
// Identifier: application/vnd.fallkeeper.jump_group+json; view=link
type JumpGroupMediaLink =  {
	href: string,
	// LiftOffAt is a time when aircraft lifted off the ground
	lift_off_at: string,
	// Size of group (number of people)
	size: number,
}
// JumpGroupMediaLinks contains links to related resources of JumpGroupMedia.
type JumpGroupMediaLinks =  {
	aircraft: AircraftMediaLink,
	dropzone: DropzoneMediaLink,
}
// JumpGroupMediaCollection is the media type for an array of JumpGroupMedia (default view)
// Identifier: application/vnd.fallkeeper.jump_group+json; type=collection; view=default
type JumpGroupMediaCollection = Array<JumpGroupMedia>
// JumpGroupMediaCollection is the media type for an array of JumpGroupMedia (link view)
// Identifier: application/vnd.fallkeeper.jump_group+json; type=collection; view=link
type JumpGroupMediaLinkCollection = Array<JumpGroupMediaLink>
// JumpGroupMediaLinksArray contains links to related resources of JumpGroupMediaCollection.
type JumpGroupMediaLinksArray = Array<JumpGroupMediaLinks>
// blob with raw jump sensors data (default view)
// Identifier: application/vnd.fallkeeper.jump_logs+json; view=default
type JumpLogsMedia =  {
	blob: {[string]: any},
	id: number,
}
// blob with raw jump sensors data (link view)
// Identifier: application/vnd.fallkeeper.jump_logs+json; view=link
type JumpLogsMediaLink =  {
	href: string,
}
// Geographic location (default view)
// Identifier: application/vnd.fallkeeper.location+json; view=default
type LocationMedia =  {
	// country code
	country: string,
	// Elevation over sea level
	elevation: number,
	// country code
	id: number,
	// latitude
	latitude: string,
	// longitude
	longitude: string,
	// region
	region: string,
	// region
	settlement: string,
	// state
	state: string,
}
// Geographic location (link view)
// Identifier: application/vnd.fallkeeper.location+json; view=link
type LocationMediaLink =  {
	// country code
	country: string,
	href: string,
	// region
	settlement: string,
}
// LocationMediaCollection is the media type for an array of LocationMedia (default view)
// Identifier: application/vnd.fallkeeper.location+json; type=collection; view=default
type LocationMediaCollection = Array<LocationMedia>
// LocationMediaCollection is the media type for an array of LocationMedia (link view)
// Identifier: application/vnd.fallkeeper.location+json; type=collection; view=link
type LocationMediaLinkCollection = Array<LocationMediaLink>
// Response object of User (default view)
// Identifier: application/vnd.fallkeeper.user+json; view=default
type UserMedia =  {
	// BaseJumpsClaimed is a count of untracked BASE jumps
	base_jumps_claimed: number,
	// BaseJumps is a count of BASE jumps
	base_jumps_tracked: number,
	// Country code
	country: string,
	created_at: string,
	first_name: string,
	// FreefallDurationClaimed is a total untracked duration of freefall in seconds
	freefall_duration_claimed: number,
	// FreefallDuration is a total duration of freefall in seconds
	freefall_duration_tracked: number,
	id: number,
	// JumpsClaimed is a numbr of untracked jumps claimed by user
	jumps_claimed: number,
	// Jumps count
	jumps_tracked: number,
	last_name: string,
	// License is a skydiving license (A,B,C...)
	license: string,
	// Links to related resources
	links: UserMediaLinks,
	// ProfileImage is a name of profile picture (must be converted to URL for desired size)
	profile_image: string,
	username: string,
	// WingLoad (canopy load)
	wing_load: number,
	// WingsuitJumpsClaimed is a total amount of untracked wingsuit jumps
	wingsuit_jumps_claimed: number,
	// WingsuitJumps is a total count of wingsuit jumps of user
	wingsuit_jumps_tracked: number,
}
// Response object of User (link view)
// Identifier: application/vnd.fallkeeper.user+json; view=link
type UserMediaLink =  {
	first_name: string,
	// Link to this user
	href: string,
	last_name: string,
	// ProfileImage is a name of profile picture (must be converted to URL for desired size)
	profile_image: string,
	username: string,
}
// Response object of User (private view)
// Identifier: application/vnd.fallkeeper.user+json; view=private
type UserMediaPrivate =  {
	// BaseJumpsClaimed is a count of untracked BASE jumps
	base_jumps_claimed: number,
	// BaseJumps is a count of BASE jumps
	base_jumps_tracked: number,
	// Country code
	country: string,
	created_at: string,
	email: string,
	first_name: string,
	// FreefallDurationClaimed is a total untracked duration of freefall in seconds
	freefall_duration_claimed: number,
	// FreefallDuration is a total duration of freefall in seconds
	freefall_duration_tracked: number,
	id: number,
	// JumpsClaimed is a numbr of untracked jumps claimed by user
	jumps_claimed: number,
	// Jumps count
	jumps_tracked: number,
	last_name: string,
	// License is a skydiving license (A,B,C...)
	license: string,
	// Links to related resources
	links: UserMediaLinks,
	// ProfileImage is a name of profile picture (must be converted to URL for desired size)
	profile_image: string,
	username: string,
	// WingLoad (canopy load)
	wing_load: number,
	// WingsuitJumpsClaimed is a total amount of untracked wingsuit jumps
	wingsuit_jumps_claimed: number,
	// WingsuitJumps is a total count of wingsuit jumps of user
	wingsuit_jumps_tracked: number,
}
// UserMediaLinks contains links to related resources of UserMedia.
type UserMediaLinks =  {
	location: LocationMediaLink,
}
// UserMediaCollection is the media type for an array of UserMedia (default view)
// Identifier: application/vnd.fallkeeper.user+json; type=collection; view=default
type UserMediaCollection = Array<UserMedia>
// UserMediaCollection is the media type for an array of UserMedia (link view)
// Identifier: application/vnd.fallkeeper.user+json; type=collection; view=link
type UserMediaLinkCollection = Array<UserMediaLink>
// UserMediaCollection is the media type for an array of UserMedia (private view)
// Identifier: application/vnd.fallkeeper.user+json; type=collection; view=private
type UserMediaPrivateCollection = Array<UserMediaPrivate>
// UserMediaLinksArray contains links to related resources of UserMediaCollection.
type UserMediaLinksArray = Array<UserMediaLinks>
// ManufacturerMedia media type (default view)
// Identifier: vnd.fallkeeper.manufacturer+json; view=default
type ManufacturerMedia =  {
	description: string,
	href: string,
	id: number,
	logo: string,
	name: string,
	website: string,
}
// ManufacturerMedia media type (link view)
// Identifier: vnd.fallkeeper.manufacturer+json; view=link
type ManufacturerMediaLink =  {
	href: string,
	logo: string,
	name: string,
}
// ManufacturerMediaCollection is the media type for an array of ManufacturerMedia (default view)
// Identifier: vnd.fallkeeper.manufacturer+json; type=collection; view=default
type ManufacturerMediaCollection = Array<ManufacturerMedia>
// ManufacturerMediaCollection is the media type for an array of ManufacturerMedia (link view)
// Identifier: vnd.fallkeeper.manufacturer+json; type=collection; view=link
type ManufacturerMediaLinkCollection = Array<ManufacturerMediaLink>
// UserGearMedia media type (default view)
// Identifier: vnd.fallkeeper.user_gear+json; view=default
type UserGearMedia =  {
	// Comment / note by user
	comment: string,
	gear: GearMedia,
	// Type of gear
	jumps_claimed: number,
	// Type of gear
	jumps_tracked: number,
	// Links to related resources
	links: UserGearMediaLinks,
	// Properties of user gear (like canopy are, if it's a canopy, or last reserve repack if it's container)
	properties: any,
	// Rating by user
	rating: number,
}
// UserGearMedia media type (link view)
// Identifier: vnd.fallkeeper.user_gear+json; view=link
type UserGearMediaLink =  {
	href: string,
	image: string,
	name: string,
}
// UserGearMediaLinks contains links to related resources of UserGearMedia.
type UserGearMediaLinks =  {
}
// UserGearMediaCollection is the media type for an array of UserGearMedia (default view)
// Identifier: vnd.fallkeeper.user_gear+json; type=collection; view=default
type UserGearMediaCollection = Array<UserGearMedia>
// UserGearMediaCollection is the media type for an array of UserGearMedia (link view)
// Identifier: vnd.fallkeeper.user_gear+json; type=collection; view=link
type UserGearMediaLinkCollection = Array<UserGearMediaLink>
// UserGearMediaLinksArray contains links to related resources of UserGearMediaCollection.
type UserGearMediaLinksArray = Array<UserGearMediaLinks>
// AircraftBase user type.
// AircraftBase user type.
type AircraftBase =  {
	// AvgCeiling an average altitude of the plane ever tracked by fallkeeper
	avg_ceiling: number,
	// Capacity is maximum number of passengers
	capacity: number,
	// Count of registered units
	count: number,
	description: string,
	id: number,
	image: string,
	// MaxCeilingTracked is a maximum altitude of the plane ever tracked by fallkeeper
	max_ceiling_tracked: number,
	name: string,
	// RateOfClimb in m/s
	rate_of_climb: number,
	// ServiceSeiling is a maximum altitude in meters
	service_ceiling: number,
	// UsefulLoad in kg
	useful_load: number,
}
// AircraftForm user type.
// AircraftForm user type.
type AircraftForm =  {
	// Capacity is maximum number of passengers
	capacity: number,
	description: string,
	image: string,
	name: string,
	// RateOfClimb in m/s
	rate_of_climb: number,
	// ServiceSeiling is a maximum altitude in meters
	service_ceiling: number,
	// UsefulLoad in kg
	useful_load: number,
}
// AircraftModel user type.
// AircraftModel user type.
type AircraftModel =  {
	// AvgCeiling an average altitude of the plane ever tracked by fallkeeper
	avg_ceiling: number,
	// Capacity is maximum number of passengers
	capacity: number,
	// Count of registered units
	count: number,
	description: string,
	id: number,
	image: string,
	// MaxCeilingTracked is a maximum altitude of the plane ever tracked by fallkeeper
	max_ceiling_tracked: number,
	name: string,
	// RateOfClimb in m/s
	rate_of_climb: number,
	// ServiceSeiling is a maximum altitude in meters
	service_ceiling: number,
	// UsefulLoad in kg
	useful_load: number,
}
// AircraftUpdateForm user type.
// AircraftUpdateForm user type.
type AircraftUpdateForm =  {
	// Capacity is maximum number of passengers
	capacity: number,
	description: string,
	image: string,
	name: string,
	// RateOfClimb in m/s
	rate_of_climb: number,
	// ServiceSeiling is a maximum altitude in meters
	service_ceiling: number,
	// UsefulLoad in kg
	useful_load: number,
}
// Dropzone user type.
// Dropzone user type.
type Dropzone =  {
	// Description of dropzone
	description: string,
	id: number,
	// JumpsTracked totally by all skydivers on this dropzone
	jumps_tracked: number,
	location_id: number,
	// Name of dropzone
	name: string,
	// Rating by user
	rating: number,
	ratings_count: number,
	// Type of dropzone
	type: string,
}
// DropzoneForm user type.
// DropzoneForm user type.
type DropzoneForm =  {
	// Description of dropzone
	description: string,
	location_id: number,
	// Name of dropzone
	name: string,
	// Type of dropzone
	type: string,
}
// DropzoneModel user type.
// DropzoneModel user type.
type DropzoneModel =  {
	// Description of dropzone
	description: string,
	id: number,
	// JumpsTracked totally by all skydivers on this dropzone
	jumps_tracked: number,
	location_id: number,
	// Name of dropzone
	name: string,
	// Rating by user
	rating: number,
	ratings_count: number,
	// Type of dropzone
	type: string,
}
// DropzoneUpdateForm user type.
// DropzoneUpdateForm user type.
type DropzoneUpdateForm =  {
	// Description of dropzone
	description: string,
	location_id: number,
	// Name of dropzone
	name: string,
	// Type of dropzone
	type: string,
}
// FieldErrors user type.
// FieldErrors user type.
type FieldErrors =  {
	// errors list
	errors: Array<string>,
	// field name
	field: string,
}
// GearBase user type.
// GearBase user type.
type GearBase =  {
	created_by: number,
	// Description of gear
	description: string,
	id: number,
	// Image
	image: string,
	manufacturer_id: number,
	// Name of gear (e.g. `Fire 2`)
	name: string,
	// Properties, like available canopy sizes
	properties: any,
	// Rating by user
	rating: number,
	ratings_count: number,
	// SeoName is manufacturer_name+name
	seo_name: string,
	// Type of gear
	type: number,
	// Verified by admins
	verified: boolean,
}
// GearForm user type.
// GearForm user type.
type GearForm =  {
	// Description of gear
	description: string,
	// Image
	image: string,
	manufacturer_id: number,
	// Name of gear (e.g. `Fire 2`)
	name: string,
	// Properties, like available canopy sizes
	properties: any,
	// Type of gear
	type: number,
}
// GearModel user type.
// GearModel user type.
type GearModel =  {
	created_by: number,
	// Description of gear
	description: string,
	id: number,
	// Image
	image: string,
	manufacturer_id: number,
	// Name of gear (e.g. `Fire 2`)
	name: string,
	// Properties, like available canopy sizes
	properties: any,
	// Rating by user
	rating: number,
	// SeoName is manufacturer_name+name
	seo_name: string,
	// Type of gear
	type: number,
	// Verified by admins
	verified: boolean,
}
// GearUpdateForm user type.
// GearUpdateForm user type.
type GearUpdateForm =  {
	// Description of gear
	description: string,
	// Image
	image: string,
	// Name of gear (e.g. `Fire 2`)
	name: string,
	// Properties, like available canopy sizes
	properties: any,
}
// JumpBase user type.
// JumpBase user type.
type JumpBase =  {
	// Altitude over ground
	altitude: number,
	// Coordinates is a (longitude,latitude) pair
	coordinates: string,
	// DeploymentAltitude is altitude of parachute deployment in meters
	deployment_altitude: number,
	// DeploymentAt timestamp
	deployment_at: string,
	dropzone_id: number,
	// FreefallDuration in seconds
	freefall_duration: number,
	// FreefallStartedAt timestamp
	freefall_started_at: string,
	id: number,
	jump_group_id: number,
	// Kind of jump (skydive|base)
	kind: string,
	// LandedAt timestamp
	landed_at: string,
	// Maximum vertical veolocity in m/s
	max_vertical_velocity: number,
	// Type of jump (wingsuit, freefly, rw...)
	type: string,
	user_gear_id: number,
	user_id: number,
}
// JumpForm user type.
// JumpForm user type.
type JumpForm =  {
	// Altitude over ground
	altitude: number,
	// Coordinates is a (longitude,latitude) pair
	coordinates: string,
	// DeploymentAltitude is altitude of parachute deployment in meters
	deployment_altitude: number,
	// DeploymentAt timestamp
	deployment_at: string,
	dropzone_id: number,
	// FreefallDuration in seconds
	freefall_duration: number,
	// FreefallStartedAt timestamp
	freefall_started_at: string,
	jump_group_id: number,
	// Kind of jump (skydive|base)
	kind: string,
	// LandedAt timestamp
	landed_at: string,
	// Maximum vertical veolocity in m/s
	max_vertical_velocity: number,
	// Type of jump (wingsuit, freefly, rw...)
	type: string,
	user_gear_id: number,
}
// JumpGroupBase user type.
// JumpGroupBase user type.
type JumpGroupBase =  {
	aircraft_id: number,
	dropzone_id: number,
	id: number,
	// LiftOffAt is a time when aircraft lifted off the ground
	lift_off_at: string,
	// Size of group (number of people)
	size: number,
}
// JumpGroupForm user type.
// JumpGroupForm user type.
type JumpGroupForm =  {
	aircraft_id: number,
	dropzone_id: number,
	id: number,
	// LiftOffAt is a time when aircraft lifted off the ground
	lift_off_at: string,
	// Size of group (number of people)
	size: number,
}
// JumpGroupModel user type.
// JumpGroupModel user type.
type JumpGroupModel =  {
	aircraft_id: number,
	dropzone_id: number,
	id: number,
	// LiftOffAt is a time when aircraft lifted off the ground
	lift_off_at: string,
	// Size of group (number of people)
	size: number,
}
// JumpLogsBase user type.
// JumpLogsBase user type.
type JumpLogsBase =  {
	blob: {[string]: any},
	id: number,
}
// JumpLogsForm user type.
// JumpLogsForm user type.
type JumpLogsForm =  {
	blob: {[string]: any},
}
// JumpLogsModel user type.
// JumpLogsModel user type.
type JumpLogsModel =  {
	blob: {[string]: any},
	id: number,
}
// JumpModel user type.
// JumpModel user type.
type JumpModel =  {
	// Altitude over ground
	altitude: number,
	// Coordinates is a (longitude,latitude) pair
	coordinates: string,
	// DeploymentAltitude is altitude of parachute deployment in meters
	deployment_altitude: number,
	// DeploymentAt timestamp
	deployment_at: string,
	dropzone_id: number,
	// FreefallDuration in seconds
	freefall_duration: number,
	// FreefallStartedAt timestamp
	freefall_started_at: string,
	id: number,
	jump_group_id: number,
	// Kind of jump (skydive|base)
	kind: string,
	// LandedAt timestamp
	landed_at: string,
	// Maximum vertical veolocity in m/s
	max_vertical_velocity: number,
	// Type of jump (wingsuit, freefly, rw...)
	type: string,
	user_gear_id: number,
	user_id: number,
}
// JumpUpdateForm user type.
// JumpUpdateForm user type.
type JumpUpdateForm =  {
	// Altitude over ground
	altitude: number,
	// DeploymentAltitude is altitude of parachute deployment in meters
	deployment_altitude: number,
	// DeploymentAt timestamp
	deployment_at: string,
	dropzone_id: number,
	// FreefallDuration in seconds
	freefall_duration: number,
	// FreefallStartedAt timestamp
	freefall_started_at: string,
	jump_group_id: number,
	// Kind of jump (skydive|base)
	kind: string,
	// LandedAt timestamp
	landed_at: string,
	// Maximum vertical veolocity in m/s
	max_vertical_velocity: number,
	// Type of jump (wingsuit, freefly, rw...)
	type: string,
	user_gear_id: number,
}
// LocationBase user type.
// LocationBase user type.
type LocationBase =  {
	// country code
	country: string,
	// Elevation over sea level
	elevation: number,
	// country code
	id: number,
	// latitude
	latitude: string,
	// longitude
	longitude: string,
	// region
	region: string,
	// region
	settlement: string,
	// state
	state: string,
}
// LocationModel user type.
// LocationModel user type.
type LocationModel =  {
	// country code
	country: string,
	// Elevation over sea level
	elevation: number,
	// country code
	id: number,
	// latitude
	latitude: string,
	// longitude
	longitude: string,
	// region
	region: string,
	// region
	settlement: string,
	// state
	state: string,
}
// LocationPayload user type.
// LocationPayload user type.
type LocationPayload =  {
	// country code
	country: string,
	// Elevation over sea level
	elevation: number,
	// latitude
	latitude: string,
	// longitude
	longitude: string,
	// region
	region: string,
	// region
	settlement: string,
	// state
	state: string,
}
// ManufacturerBase user type.
// ManufacturerBase user type.
type ManufacturerBase =  {
	created_by: number,
	description: string,
	id: number,
	logo: string,
	name: string,
	// Rating by user
	rating: number,
	ratings_count: number,
	// Verified by admins
	verified: boolean,
	website: string,
}
// ManufacturerForm user type.
// ManufacturerForm user type.
type ManufacturerForm =  {
	description: string,
	logo: string,
	name: string,
	website: string,
}
// ManufacturerModel user type.
// ManufacturerModel user type.
type ManufacturerModel =  {
	created_by: number,
	description: string,
	id: number,
	logo: string,
	name: string,
	// Verified by admins
	verified: boolean,
	website: string,
}
// ManufacturerUpdateForm user type.
// ManufacturerUpdateForm user type.
type ManufacturerUpdateForm =  {
	description: string,
	logo: string,
	name: string,
	website: string,
}
// RegisterPayload is a register request body
// RegisterPayload is a register request body
type RegisterPayload =  {
	// Country code
	country: string,
	email: string,
	first_name: string,
	last_name: string,
	// password is a password
	password: string,
	username: string,
}
// UserBase user type.
// UserBase user type.
type UserBase =  {
	// BaseJumpsClaimed is a count of untracked BASE jumps
	base_jumps_claimed: number,
	// BaseJumps is a count of BASE jumps
	base_jumps_tracked: number,
	// Country code
	country: string,
	created_at: string,
	email: string,
	email_confirmed_at: string,
	encrypted_password: string,
	first_name: string,
	// FreefallDurationClaimed is a total untracked duration of freefall in seconds
	freefall_duration_claimed: number,
	// FreefallDuration is a total duration of freefall in seconds
	freefall_duration_tracked: number,
	id: number,
	is_admin: boolean,
	// JumpsClaimed is a numbr of untracked jumps claimed by user
	jumps_claimed: number,
	// Jumps count
	jumps_tracked: number,
	last_name: string,
	// License is a skydiving license (A,B,C...)
	license: string,
	// Location of user
	location: LocationPayload,
	location_id: number,
	// password is a password
	password: string,
	// ProfileImage is a name of profile picture (must be converted to URL for desired size)
	profile_image: string,
	updated_at: string,
	username: string,
	// WingLoad (canopy load)
	wing_load: number,
	// WingsuitJumpsClaimed is a total amount of untracked wingsuit jumps
	wingsuit_jumps_claimed: number,
	// WingsuitJumps is a total count of wingsuit jumps of user
	wingsuit_jumps_tracked: number,
}
// UserGearBase user type.
// UserGearBase user type.
type UserGearBase =  {
	// Comment / note by user
	comment: string,
	gear_id: number,
	id: number,
	// Type of gear
	jumps_claimed: number,
	// Type of gear
	jumps_tracked: number,
	// Properties of user gear (like canopy are, if it's a canopy, or last reserve repack if it's container)
	properties: any,
	// Rating by user
	rating: number,
	ratings_count: number,
	user_id: number,
}
// UserGearForm user type.
// UserGearForm user type.
type UserGearForm =  {
	// Comment / note by user
	comment: string,
	gear_id: number,
	// Type of gear
	jumps_claimed: number,
	// Properties of user gear (like canopy are, if it's a canopy, or last reserve repack if it's container)
	properties: any,
}
// UserGearModel user type.
// UserGearModel user type.
type UserGearModel =  {
	// Comment / note by user
	comment: string,
	gear_id: number,
	id: number,
	// Type of gear
	jumps_claimed: number,
	// Type of gear
	jumps_tracked: number,
	// Properties of user gear (like canopy are, if it's a canopy, or last reserve repack if it's container)
	properties: any,
	// Rating by user
	rating: number,
	user_id: number,
}
// UserGearUpdateForm user type.
// UserGearUpdateForm user type.
type UserGearUpdateForm =  {
	// Comment / note by user
	comment: string,
	// Type of gear
	jumps_claimed: number,
	// Properties of user gear (like canopy are, if it's a canopy, or last reserve repack if it's container)
	properties: any,
}
// UserModel user type.
// UserModel user type.
type UserModel =  {
	// BaseJumpsClaimed is a count of untracked BASE jumps
	base_jumps_claimed: number,
	// BaseJumps is a count of BASE jumps
	base_jumps_tracked: number,
	// Country code
	country: string,
	email: string,
	email_confirmed_at: string,
	encrypted_password: string,
	first_name: string,
	// FreefallDurationClaimed is a total untracked duration of freefall in seconds
	freefall_duration_claimed: number,
	// FreefallDuration is a total duration of freefall in seconds
	freefall_duration_tracked: number,
	id: number,
	is_admin: boolean,
	// JumpsClaimed is a numbr of untracked jumps claimed by user
	jumps_claimed: number,
	// Jumps count
	jumps_tracked: number,
	last_name: string,
	// License is a skydiving license (A,B,C...)
	license: string,
	location_id: number,
	// ProfileImage is a name of profile picture (must be converted to URL for desired size)
	profile_image: string,
	username: string,
	// WingLoad (canopy load)
	wing_load: number,
	// WingsuitJumpsClaimed is a total amount of untracked wingsuit jumps
	wingsuit_jumps_claimed: number,
	// WingsuitJumps is a total count of wingsuit jumps of user
	wingsuit_jumps_tracked: number,
}
// UserUpdatePayload user type.
// UserUpdatePayload user type.
type UserUpdatePayload =  {
	// BaseJumpsClaimed is a count of untracked BASE jumps
	base_jumps_claimed: number,
	// Country code
	country: string,
	email: string,
	first_name: string,
	// FreefallDurationClaimed is a total untracked duration of freefall in seconds
	freefall_duration_claimed: number,
	// JumpsClaimed is a numbr of untracked jumps claimed by user
	jumps_claimed: number,
	last_name: string,
	// License is a skydiving license (A,B,C...)
	license: string,
	location_id: number,
	// ProfileImage is a name of profile picture (must be converted to URL for desired size)
	profile_image: string,
	username: string,
	// WingLoad (canopy load)
	wing_load: number,
	// WingsuitJumpsClaimed is a total amount of untracked wingsuit jumps
	wingsuit_jumps_claimed: number,
}

export default Client
