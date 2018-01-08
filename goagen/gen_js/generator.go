package genjs

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"text/template"
	"time"

	"github.com/goadesign/goa/design"
	"github.com/goadesign/goa/goagen/codegen"
	"github.com/goadesign/goa/goagen/jsgen"
	"github.com/goadesign/goa/goagen/utils"
)

//NewGenerator returns an initialized instance of a JavaScript Client Generator
func NewGenerator(options ...Option) *Generator {
	g := &Generator{}

	for _, option := range options {
		option(g)
	}

	return g
}

// Generator is the application code generator.
type Generator struct {
	API       *design.APIDefinition // The API definition
	OutDir    string                // Destination directory
	Timeout   time.Duration         // Timeout used by JavaScript client when making requests
	Scheme    string                // Scheme used by JavaScript client
	Host      string                // Host addressed by JavaScript client
	NoExample bool                  // Do not generate an HTML example file
	genfiles  []string              // Generated files
}

// Generate is the generator entry point called by the meta generator.
func Generate() (files []string, err error) {
	var (
		outDir, ver  string
		timeout      time.Duration
		scheme, host string
		noexample    bool
	)

	set := flag.NewFlagSet("client", flag.PanicOnError)
	set.StringVar(&outDir, "out", "", "")
	set.String("design", "", "")
	set.DurationVar(&timeout, "timeout", time.Duration(20)*time.Second, "")
	set.StringVar(&scheme, "scheme", "", "")
	set.StringVar(&host, "host", "", "")
	set.StringVar(&ver, "version", "", "")
	set.BoolVar(&noexample, "noexample", false, "")
	set.Parse(os.Args[1:])

	// First check compatibility
	if err := codegen.CheckVersion(ver); err != nil {
		return nil, err
	}

	// Now proceed
	g := &Generator{OutDir: outDir, Timeout: timeout, Scheme: scheme, Host: host, NoExample: noexample, API: design.Design}

	return g.Generate()
}

// Generate produces the skeleton main.
func (g *Generator) Generate() (_ []string, err error) {
	if g.API == nil {
		return nil, fmt.Errorf("missing API definition, make sure design is properly initialized")
	}

	go utils.Catch(nil, func() { g.Cleanup() })

	defer func() {
		if err != nil {
			g.Cleanup()
		}
	}()

	if g.Timeout == 0 {
		g.Timeout = 20 * time.Second
	}
	if g.Scheme == "" && len(g.API.Schemes) > 0 {
		g.Scheme = g.API.Schemes[0]
	}
	if g.Scheme == "" {
		g.Scheme = "http"
	}
	if g.Host == "" {
		g.Host = g.API.Host
	}
	if g.Host == "" {
		return nil, fmt.Errorf("missing host value, set it with --host")
	}

	g.OutDir = filepath.Join(g.OutDir, "js")
	if err := os.RemoveAll(g.OutDir); err != nil {
		return nil, err
	}
	if err := os.MkdirAll(g.OutDir, 0755); err != nil {
		return nil, err
	}
	g.genfiles = append(g.genfiles, g.OutDir)

	// Generate client.js
	err = g.generateJS(filepath.Join(g.OutDir, "client.js"))
	if err != nil {
		return
	}

	return g.genfiles, nil
}

// MediaTypesWriter generate code for a goa application media types.
// Media types are data structures used to render the response bodies.
type MediaTypesWriter struct {
	*codegen.SourceFile
	MediaTypeTmpl *template.Template
	Validator     *codegen.Validator
}

// NewMediaTypesWriter returns a contexts code writer.
// Media types contain the data used to render response bodies.
func NewMediaTypesWriter(filename string) (*MediaTypesWriter, error) {
	file, err := codegen.SourceFileFor(filename)
	if err != nil {
		return nil, err
	}
	return &MediaTypesWriter{SourceFile: file, Validator: codegen.NewValidator()}, nil
}

// Execute writes the code for the context types to the writer.
func (w *MediaTypesWriter) Execute(mt *design.MediaTypeDefinition) error {
	var (
		mLinks *design.UserTypeDefinition
		fn     = template.FuncMap{
			"validationCode": w.Validator.Code,
			"jstypedesc":     jsgen.JsTypeDesc,
			"jstypedef":      jsgen.JsTypeDef,
			"jstypename":     jsgen.JsTypeName,
		}
	)
	err := mt.IterateViews(func(view *design.ViewDefinition) error {
		p, links, err := mt.Project(view.Name)
		if mLinks == nil {
			mLinks = links
		}
		if err != nil {
			return err
		}
		if err := w.ExecuteTemplate("mediatype", mediaTypeT, fn, p); err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		return err
	}
	// TODO:
	if mLinks != nil {
		if err := w.ExecuteTemplate("mediatypelink", mediaTypeLinkT, fn, mLinks); err != nil {
			return err
		}
	}
	return nil
}

// ExecuteTemplate executes the template and writes the output to the file.
func (f *MediaTypesWriter) ExecuteTemplate(name, source string, funcMap template.FuncMap, data interface{}) error {
	tmpl, err := template.New(name).Funcs(jsgen.DefaultFuncMap).Funcs(funcMap).Parse(source)
	if err != nil {
		panic(err) // bug
	}
	return tmpl.Execute(f, data)
}

// UserTypesWriter generate code for a goa application user types.
// User types are data structures defined in the DSL with "Type".
type UserTypesWriter struct {
	*codegen.SourceFile
	UserTypeTmpl *template.Template
	Finalizer    *codegen.Finalizer
	Validator    *codegen.Validator
}

// NewUserTypesWriter returns a contexts code writer.
// User types contain custom data structured defined in the DSL with "Type".
func NewUserTypesWriter(filename string) (*UserTypesWriter, error) {
	file, err := codegen.SourceFileFor(filename)
	if err != nil {
		return nil, err
	}
	return &UserTypesWriter{
		SourceFile: file,
		Finalizer:  codegen.NewFinalizer(),
		Validator:  codegen.NewValidator(),
	}, nil
}

// Execute writes the code for the context types to the writer.
func (w *UserTypesWriter) Execute(t *design.UserTypeDefinition) error {
	fn := template.FuncMap{
		"finalizeCode":   w.Finalizer.Code,
		"validationCode": w.Validator.Code,
		"jstypedesc":     jsgen.JsTypeDesc,
		"jstypedef":      jsgen.JsTypeDef,
		"jstypename":     jsgen.JsTypeName,
	}
	return w.ExecuteTemplate("types", userTypeT, fn, t)
}

// generateMediaTypes iterates through the media types and generate the data structures and
// marshaling code.
func (g *Generator) generateFlowTypes(jsFile string) error {
	mtWr, err := NewMediaTypesWriter(jsFile)
	if err != nil {
		panic(err) // bug
	}
	err = mtWr.Execute(design.ErrorMedia)
	if err != nil {
		return err
	}
	err = g.API.IterateMediaTypes(func(mt *design.MediaTypeDefinition) error {
		if mt.IsError() {
			return nil
		}
		if mt.Type.IsObject() || mt.Type.IsArray() {
			return mtWr.Execute(mt)
		}
		return nil
	})
	if err != nil {
		return err
	}
	err = mtWr.FormatCode()
	if err != nil {
		return err
	}

	// user types

	utWr, err := NewUserTypesWriter(jsFile)
	if err != nil {
		panic(err) // bug
	}
	err = g.API.IterateUserTypes(func(td *design.UserTypeDefinition) error {
		if td.Type.IsObject() || td.Type.IsArray() {
			return utWr.Execute(td)
		}
		return nil
	})

	// already added in generateJS
	//g.genfiles = append(g.genfiles, jsFile)
	if err != nil {
		return err
	}
	return utWr.FormatCode()

}

func (g *Generator) generateJS(jsFile string) (err error) {
	file, err := codegen.SourceFileFor(jsFile)
	if err != nil {
		return
	}
	defer file.Close()
	g.genfiles = append(g.genfiles, jsFile)

	data := map[string]interface{}{
		"API":     g.API,
		"Host":    g.Host,
		"Scheme":  g.Scheme,
		"Timeout": int64(g.Timeout / time.Millisecond),
	}
	if err = file.ExecuteTemplate("module", moduleT, nil, data); err != nil {
		return
	}

	actions := make(map[string][]*design.ActionDefinition)
	g.API.IterateResources(func(res *design.ResourceDefinition) error {
		return res.IterateActions(func(action *design.ActionDefinition) error {
			if as, ok := actions[action.Name]; ok {
				actions[action.Name] = append(as, action)
			} else {
				actions[action.Name] = []*design.ActionDefinition{action}
			}
			return nil
		})
	})

	keys := []string{}
	for n := range actions {
		keys = append(keys, n)
	}
	sort.Strings(keys)
	for _, n := range keys {
		for _, a := range actions[n] {
			data := map[string]interface{}{"Action": a}
			funcs := template.FuncMap{
				"params":     params,
				"jspath":     jspath,
				"pathParams": pathParams,
				"jstypename": jsgen.JsTypeName,
				"jstypedef":  jsgen.JsTypeDef,
				"jstypedesc": jsgen.JsTypeDesc,
				"jsify":      jsgen.Jsify,
			}
			if err = file.ExecuteTemplate("jsFuncs", jsFuncsT, funcs, data); err != nil {
				return
			}
		}
	}

	// end class Client
	_, err = file.Write([]byte("}\n\n"))

	err = g.generateFlowTypes(jsFile)
	if err != nil {
		return err
	}

	_, err = file.Write([]byte(moduleTend))
	return err
}

// Cleanup removes all the files generated by this generator during the last invokation of Generate.
func (g *Generator) Cleanup() {
	for _, f := range g.genfiles {
		os.Remove(f)
	}
	g.genfiles = nil
}

func params(action *design.ActionDefinition) []string {
	if action.QueryParams == nil {
		return nil
	}
	params := make([]string, len(action.QueryParams.Type.ToObject()))
	i := 0
	for n, t := range action.QueryParams.Type.ToObject() {
		params[i] = fmt.Sprintf("%s: %s", n, jsgen.JsTypeName(t.Type, nil, 1, false))
		i++
	}
	sort.Strings(params)
	return params
}

func pathParams(action *design.ActionDefinition) string {
	if len(action.Routes) == 0 {
		return ""
	}
	p := action.Routes[0].Params()
	ret := make([]string, len(p))
	for i, v := range p {
		ret[i] = fmt.Sprintf("%s: number|string", jsgen.Jsify(v, false))
	}
	return strings.Join(ret, ", ")
}

func jspath(action *design.ActionDefinition) string {
	if len(action.Routes) == 0 {
		return ""
	}
	r := action.Routes[0]

	fp := "'" + r.FullPath() + "'"
	for _, p := range r.Params() {
		fp = strings.Replace(fp, ":"+p, "'+"+jsgen.Jsify(p, false)+"+'", -1)
	}

	return fp
}

// mediaTypeT generates the code for a media type.
// template input: MediaTypeTemplateData
const mediaTypeT = `// {{ jstypedesc . true }}
// Identifier: {{ .Identifier }}{{ $typeName := jstypename . .AllRequired 0 false }}
export type {{ $typeName }} = {{ jstypedef . 0 true false }}

`

// userTypeT generates the code for a user type.
// template input: UserTypeTemplateData
const userTypeT = `// {{ jstypedesc . true }}{{ $typeName := jstypename . .AllRequired 0 false }}
export type {{ $typeName }} = {{ jstypedef . 0 true false }}

`

// TODO:
// mediaTypeLinkT generates the code for a media type link.
// template input: MediaTypeLinkTemplateData
const mediaTypeLinkT = `// {{ jstypedesc . true }}{{ $typeName := jstypename . .AllRequired 0 false }}
export type {{ $typeName }} = {{ jstypedef . 0 true false }}
`

const jsFuncsT = `{{$params := params .Action}}{{$name := printf "%s%s" .Action.Name (title .Action.Parent.Name)}}  // {{$name}}Path builds URL path for {{$name}}
  {{jsify $name false}}Path({{pathParams .Action}}) {
    return {{jspath .Action}}
  }

  {{$params := params .Action}}{{$name := printf "%s%sRequest" .Action.Name (title .Action.Parent.Name)}}// {{if .Action.Description}}{{.Action.Description}}{{else}}{{$name}} calls the {{.Action.Name}} action of the {{.Action.Parent.Name}} resource.{{end}}
  {{if .Action.Payload}}// data contains the action payload (request body)
  {{end}}{{if $params}}// {{join $params ", "}} {{if gt (len $params) 1}}are{{else}}is{{end}} used to build the request query string.
  {{end}}// config is an optional object to be merged into the config built by the function prior to making the request.
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
  {{ jsify $name false}}(path: string{{if .Action.Payload}}, data: {{jstypename .Action.Payload nil 0 false}}{{end}}{{if $params}}, query: {{"{"}}{{join $params ", "}}{{"}"}}{{end}}, config?: Object): ApiRequest {
    let cfg = {
      method: '{{toLower (index .Action.Routes 0).Verb}}',
{{if .Action.Payload}}      body: JSON.stringify(data),
{{end}}
    }
    if (config) {
      Object.assign(cfg, config);
    }
    {{if $params}}path += '?' + queryString.stringify(query){{end}}
    return new ApiRequest(this, path, cfg)
  }

  {{$params := params .Action}}{{$name := printf "%s%s" .Action.Name (title .Action.Parent.Name)}}// {{if .Action.Description}}{{.Action.Description}}{{else}}{{$name}} calls the {{.Action.Name}} action of the {{.Action.Parent.Name}} resource.{{end}}
  {{if .Action.Payload}}// data contains the action payload (request body)
  {{end}}{{if $params}}// {{join $params ", "}} {{if gt (len $params) 1}}are{{else}}is{{end}} used to build the request query string.
  {{end}}// config is an optional object to be merged into the config built by the function prior to making the request.
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
  {{ jsify $name false}}(path: string{{if .Action.Payload}}, data: {{jstypename .Action.Payload nil 0 false}}{{end}}{{if $params}}, query: {{"{"}}{{join $params ", "}}{{"}"}}{{end}}, config?: Object) {
    return this.{{ jsify $name false}}Request(path{{if .Action.Payload}}, data{{end}}{{if $params}}, query{{end}}, config).do()
  }

  {{$params := params .Action}}{{$name := printf "%s%s" .Action.Name (title .Action.Parent.Name)}}// {{if .Action.Description}}{{.Action.Description}}{{else}}{{$name}} calls the {{.Action.Name}} action of the {{.Action.Parent.Name}} resource.{{end}}
  {{if .Action.Payload}}// data contains the action payload (request body)
  {{end}}{{if $params}}// {{join $params ", "}} {{if gt (len $params) 1}}are{{else}}is{{end}} used to build the request query string.
  {{end}}// config is an optional object to be merged into the config built by the function prior to making the request.
  // This function returns a promise which raises an error if the HTTP response is a 4xx or 5xx.
  {{ jsify $name false}}Action(path: string, {{if .Action.Payload}}data: {{jstypename .Action.Payload nil 0 false}}, {{end}}{{if $params}}{{if .Action.Payload}}, {{end}}query: {{"{"}}{{join $params ", "}}{{"}"}}, {{end}}config?: Object): ApiRequestAction {
    let req = this.{{ jsify $name false}}Request(path{{if .Action.Payload}}, data{{end}}{{if $params}}, query{{end}}, config)
    return {type: 'API_REQUEST', id: '{{ jsify $name false}}_'+req.config.method+'_'+req.url,  name: '{{ jsify $name false}}', method: req.config.method, url: req.url, request: req, createdAt: new Date()}
  }
`

const moduleT = `// @flow

import { call, fork, put, take, select } from 'redux-saga/effects'
import queryString from 'query-string'

const autobind = self => {
  for (const key of Object.getOwnPropertyNames(self.constructor.prototype)) {
    // $FlowExpectedError
    const val = self[key]
    if (key !== 'constructor' && typeof val === 'function') {
      // $FlowExpectedError
      self[key] = val.bind(self)
    }
  }
  return self
}

export class ApiRequest {
  api: Client
  url: string
  config: Object

  constructor (api: Client, url: string, config: Object) {
    this.api = api
    this.url = url
    this.config = config

    autobind(this)
  }

  do (): Promise<ApiResponse|ApiError> {
    return this.api.request(this.url, this.config)
  }
}

export class ApiResponse {
  // Response
  raw: {
    type: string,
    status: number,
    ok: boolean,
    statusText: string,
    headers: {
      map: {[string]:string}
    },
    url: string
  }
  json: Object

  constructor (resp: any, json: Object) {
    this.raw = resp
    this.json = json
  }
}

export class ApiError extends Error {
  err: error
  constructor (err: error) {
    super(err.detail)
    this.err = err
  }
}

function getResponseError (resp: error): Error {
  return new ApiError(resp)
}

function unknownError (err: Error): Error {
  let ae = new ApiError({
    code: '-1',
    // a human-readable explanation specific to this occurrence of the problem.
    detail: err.message,
    // a unique identifier for this particular occurrence of the problem.
    id: 'unknown',
    // a meta object containing non-standard meta-information about the error.
    meta: {},
    // the HTTP status code applicable to this problem, expressed as a string value.
    status: 'unknow error'
  })
  return ae
}

function timeoutPromise (timeout: number, promise: Promise<*>): Promise<*> {
  return new Promise((resolve, reject) => {
    promise.then(resolve, reject)
    setTimeout((_resp?: Object) => {
      reject(new Error('request_timeout'))
    }, timeout)
  })
}

export type ApiRequestAction = {
  type: 'API_REQUEST',
  id: string,
  name: string,
  url: string,
  method: string,
  request: ApiRequest,
}

export type ApiRequestState = {
  fetching: bool,
  error: ApiError | null,
  response: Object | null,
  startedAt: Date | null,
  finishedAt: Date | null,
}

const ActionTypes = {
  REQUEST: 'API_REQUEST',
  REQUEST_SUCCESS: 'API_REQUEST_SUCCES',
  REQUEST_ERROR: 'API_REQUEST_ERROR'
}

export const ApiActionTypes = ActionTypes

export const reducer = (state: Object = {}, action: any): any => {
  if (!action) {
    return state
  }
  let ns = {...state}
  let req: ApiRequestState = ns[action.id] || {fetching: true, error: null, response: null, startedAt: new Date(), finishedAt: null}
  if (req) {
    req = {...req}
  }
  ns[action.id] = req
  switch (action.type) {
    case 'API_REQUEST_START':
      return ns
    case 'API_REQUEST_SUCCESS':
      req.fetching = false
      req.finishedAt = new Date()
      req.response = action.response
      return ns
    case 'API_REQUEST_ERROR':
      req.fetching = false
      req.finishedAt = new Date()
      req.error = action.error
      return ns
  }
  return state
}

function * saga (api: Client): any {
  while (true) {
    let action: ApiRequestAction = yield take('API_REQUEST')
    let state = yield select((s) => s.api)
    let act = state[action.id]
    if (act) {
      if (act.fetching) {
        continue
      }
    }
    yield put({type: 'API_REQUEST_START', id: action.id })
    yield fork(runRequest, action)
  }
}

function * runRequest (action: ApiRequestAction): any {
  try {
    console.log('Executing request...')
    let resp: ApiResponse = yield call(action.request.do)
    yield put({type: ActionTypes.REQUEST_SUCCESS, id: action.id, response: resp})
  } catch (error) {
    yield put({type: ActionTypes.REQUEST_ERROR, id: action.id, error})
  }
}

export const apiSaga = saga

const responseWithID = (id) => (a) => [ActionTypes.REQUEST_SUCCESS, ActionTypes.REQUEST_ERROR].includes(a.type) && a.id === id

const respSuccess = (resp) => resp.type === ActionTypes.REQUEST_SUCCESS

// request is a saga helper for performing requests
// example:
//    let {res, err} = yield call(request, api.registerAuthAction(api.registerAuthPath(), action.form))
// $FlowExpectedError
export function * request (r: ApiRequestAction) {
  yield put(r)
  let res = yield take(responseWithID(r.id))
  if (respSuccess(res)) {
    return { res: res.response }
  }
  return { err: res.error }
}


class Client {
  scheme: string
  host: string
  timeout: number
  authHeader: Object | null
  urlPrefix: string

  constructor (scheme?: string, host?: string, timeout?: number, authHeader?: Object) {
    this.scheme = scheme || 'http'
    this.host = host || 'localhost:9099'
    this.timeout = timeout || 20000
    this.authHeader = authHeader || null
    this.urlPrefix = this.scheme + '://' + this.host

    autobind(this)
  }

  setAuthHeader (hdr: Object) {
    this.authHeader = hdr
  }

  resetAuthHeader () {
    this.authHeader = null
  }

  request (path: string, config?: Object|null): Promise<ApiResponse|ApiError> {
    let cfg = {
      timeout: this.timeout,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    if (this.authHeader) {
      Object.assign(cfg.headers, this.authHeader)
    }
    if (config) {
      Object.assign(cfg, config)
    }
    let url = this.urlPrefix + path
    let reqp = new Promise((resolve, reject) => {
      fetch(url, cfg).then((resp) => {
        if (resp.ok) {
          resp.json().then((json) => resolve(new ApiResponse(resp, json)))
        } else {
          resp.json().then((j) => reject(getResponseError(j)))
        }
      }).catch((err) => {
        reject(unknownError(err))
      })
    })
    return timeoutPromise(cfg.timeout, reqp)
  }
`

const moduleTend = `
export default Client
`
