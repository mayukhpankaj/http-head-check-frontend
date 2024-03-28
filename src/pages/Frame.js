import SecurityReportSummaryContainer from "../components/SecurityReportSummaryContainer";
import "./Frame.css";
import React, { useState, useEffect } from "react";
import akto from './akto.jpeg'
import { v4 as uuidv4 } from 'uuid';

const Frame = () => {
  const [inputText, setInputText] = useState("");

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const [click, setclick] = useState(false);

  const [data, setData] = useState(null);
  const [missing, setMissing] = useState([]);
  const [up,setUp] = useState([]);
  const [warn,setWarn] = useState([]);
  const [info,setInfo] = useState([]);
  const [present, setPresent] = useState([]);
  const [currentTime, setCurrentTime] = useState("");

  const [error, setError] = useState(false);
  const [errMessage, seterrMessage] = useState('invalid url')

  const isUrlValid = (url = '') => {
    if (typeof (url) !== 'string') return false
    const regex = /(?:^|[ \t])((https?:\/\/)?(?:localhost|[\w-]+(?:\.[\w-]+)+)(:\d+)?(\/\S*)?)/g
    return regex.test(url)
  }

  function formatURL(url) {
    if (typeof url !== 'string') return false;
  
    const regex = /(?:^|[ \t])((https?:\/\/)?(?:localhost|[\w-]+(?:\.[\w-]+)+)(:\d+)?(\/\S*)?)/g;
    
    // If the protocol is missing, add "http://" to the beginning
    if (!/^https?:\/\//i.test(url)) {
      // Check if any other protocol is specified
      if (!/^(\w+):\/\//i.test(url)) {
        url = "http://" + url;
      }
    }

    return url
    
  }
  


  const policy = {
    "content-security-policy":{ text: "Protects against XSS attacks by whitelisting approved content sources.", link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP" } ,
    "referrer-policy": { text: "Controls the amount of information sent with navigations away from a document." , link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy" } ,
    "strict-transport-security": { text: "Enforces secure HTTPS connections to mitigate man-in-the-middle attacks.", link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security" },
    "x-xss-protection": { text: "Enforces secure HTTPS connections to mitigate man-in-the-middle attacks." , link:"https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection" } ,
    "x-content-type-options": { text: "Prevents MIME-sniffing and forces the browser to stick with the declared content type.", link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options"} ,
    "permissions-policy": { text: "Controls which features and APIs can be used in the browser." , link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Permissions_Policy"} ,
    "access-control-allow-origin": { text: "Specifies which origins can access the resource." , link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin"},
    "access-control-allow-methods": { text: "Specifies the HTTP methods allowed when accessing the resource.", link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods" } ,
    "access-control-allow-headers": { text: "Specifies the allowed headers when accessing the resource." , link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers" } ,
    "link": { text: "Defines relationships between the current document and other documents.", link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link" }  ,
    "age": { text:  "Indicates the age of the resource.", link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Age" },
    "cache-control": { text: "Directives for caching mechanisms in both requests and responses.", link:"https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control" }  ,
    "content-length": { text: "Specifies the size of the entity-body." , link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length" } ,
    "content-type": { text: "Indicates the media type of the resource." , link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type" }  ,
    "x-powered-by":{ text: "Reveals information about the server's technology stack.", link: "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html"} ,
    "x-aspnet-version": { text: "Discloses the version of ASP.NET being used.", link: "https://www.iothreat.com/blog/x-aspnet-version-response-header" }  ,
    "via": { text: "Indicates the intermediate protocols and recipients between the client and the server.", link: "https://http.dev/via"}  ,
    "x-cache": { text: "Indicates whether the response was fetched from a cache.", link: "https://stackoverflow.com/a/40113662"} ,
    "x-request-id": { text:"Provides a unique identifier for the request." , link: "https://http.dev/x-request-id" }  ,
    "x-amz-requestid": { text: "Amazon-specific header that provides a unique identifier for the request.", link:"https://docs.aws.amazon.com/AmazonS3/latest/API/RESTCommonResponseHeaders.html" } ,
    "p3p": { text:"Used for defining the website's privacy policy." , link: "https://www.w3.org/2001/08/draft-w3c-p3p-header-00.html#2"}  ,
    "expires": { text:"Specifies a date/time after which the resource should be considered stale." , link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expires"}  ,
    "x-frame-options": { text:  "Controls whether a page can be loaded in a frame or iframe.", link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options"} ,
    "x-ua-compatible": { text:"Instructs IE to use a specific version rendering engine." , link: "https://http.dev/x-ua-compatible"  }  ,
    "pragma" : { text:"Provides directives for caching mechanisms in requests and responses.", link:"https://www.holisticseo.digital/technical-seo/web-accessibility/http-header/pragma" } ,
    "cross-origin-embedder-policy" : { text:"Controls whether a web page can be embedded cross-origin.", link: "" }, 
    "cross-origin-opener-policy" : { text:"Manages how a web page interacts with other origins, protect against cross-origin threats", link:""}, 
    "cross-origin-resource-policy" : { "text":"Governs resource sharing across origins, preventing unauthorized access" , link: ""}, 
    
      "www-authenticate": {
        "text": "Specifies the authentication method that should be used to gain access to a resource.",
        "link": ""
      },
      "authorization": {
        "text": "Contains credentials for authenticating the client with a server.",
        "link": ""
      },
      "proxy-authenticate": {
        "text": "Specifies the authentication method that should be used by a proxy server.",
        "link": ""
      },
      "proxy-authorization": {
        "text": "Provides credentials for authenticating with a proxy server.",
        "link": ""
      },

      "cache-control": {
        "text": "Directives for caching mechanisms in both requests and responses.",
        "link": ""
      },
      "clear-site-data": {
        "text": "Instructs the browser to clear browsing data associated with a given origin.",
        "link": ""
      },

      "warning": {
        "text": "Carries additional information about the status or transformation of a message.",
        "link": ""
      },
      "accept-ch": {
        "text": "Lists client preferences for server processing hints.",
        "link": ""
      },
      "network client hints": {
        "text": "Allows the client to send device and network-related information.",
        "link": ""
      },
      "save-data": {
        "text": "Indicates the user's preference for reduced data usage.",
        "link": ""
      },
      "last-modified": {
        "text": "Specifies the date and time the resource was last modified.",
        "link": ""
      },
      "etag": {
        "text": "Provides a unique identifier for a specific version of a resource.",
        "link": ""
      },
      "if-match": {
        "text": "Performs conditional requests based on the presence and value of an ETag.",
        "link": ""
      },
      "if-none-match": {
        "text": "Performs conditional requests based on the absence or mismatch of an ETag.",
        "link": ""
      },
      "if-modified-since": {
        "text": "Performs conditional requests based on the modification date of a resource.",
        "link": ""
      },
      "if-unmodified-since": {
        "text": "Performs conditional requests based on the lack of modification to a resource.",
        "link": ""
      },
      "vary": {
        "text": "Specifies which request headers were used to select a representation.",
        "link": ""
      },
      "delta-base": {
        "text": "Provides a delta-encoding base value for use with delta encoding.",
        "link": ""
      },
      "connection": {
        "text": "Controls options for the current connection.",
        "link": ""
      },
      "keep-alive": {
        "text": "Requests a persistent connection.",
        "link": ""
      },
      "accept": {
        "text": "Lists acceptable content types for the response.",
        "link": ""
      },
      "accept-encoding": {
        "text": "Lists acceptable encodings for the response.",
        "link": ""
      },
      "accept-language": {
        "text": "Lists acceptable languages for the response.",
        "link": ""
      },
      "a-im": {
        "text": "Lists the acceptable instance-manipulations for the response.",
        "link": ""
      },
      "im": {
        "text": "Lists the instance-manipulations that have been applied to the response.",
        "link": ""
      },
      "expect": {
        "text": "Indicates certain expectations that need to be met by the server.",
        "link": ""
      },
      "max-forwards": {
        "text": "Specifies the maximum number of times a request can be forwarded by proxies.",
        "link": ""
      },
      "cookie": {
        "text": "Contains stored HTTP cookies.",
        "link": ""
      },
      "set-cookie": {
        "text": "Sets an HTTP cookie in the response.",
        "link": ""
      },
      "access-control-allow-origin": {
        "text": "Specifies which origins are allowed to access a resource.",
        "link": ""
      },
      "access-control-allow-credentials": {
        "text": "Indicates whether credentials can be included with cross-origin requests.",
        "link": ""
      },
      "access-control-allow-headers": {
        "text": "Lists which HTTP headers can be used during a CORS request.",
        "link": ""
      },
      "access-control-expose-headers": {
        "text": "Lists which HTTP headers are exposed to the browser in the response.",
        "link": ""
      },
      "access-control-max-age": {
        "text": "Indicates how long the results of a preflight request can be cached.",
        "link": ""
      },
      "access-control-request-headers": {
        "text": "Used when issuing a preflight request to let the server know which HTTP headers will be used in the actual request.",
        "link": ""
      },
      "access-control-request-method": {
        "text": "Used when issuing a preflight request to let the server know which HTTP method will be used in the actual request.",
        "link": ""
      },
      "timing-allow-origin": {
        "text": "Specifies origins that are allowed to access timing information.",
        "link": ""
      },
      "content-disposition": {
        "text": "Provides information on how to handle the content disposition of the response payload.",
        "link": ""
      },


      "content-encoding": {
        "text": "Specifies the encoding format of the response.",
        "link": ""
      },
      "content-language": {
        "text": "Specifies the language(s) intended for the audience.",
        "link": ""
      },
      "content-location": {
        "text": "Specifies a URI for the resource associated with the response.",
        "link": ""
      },
      "forwarded": {
        "text": "Contains information from the client-facing side of proxy servers.",
        "link": ""
      },
      "x-forwarded-for": {
        "text": "Identifies the original IP address of a client connecting to a web server through an HTTP proxy or a load balancer.",
        "link": ""
      },
      "x-forwarded-host": {
        "text": "Identifies the original host requested by the client.",
        "link": ""
      },
      "x-forwarded-proto": {
        "text": "Identifies the protocol (HTTP or HTTPS) that a client used to connect to your proxy or load balancer.",
        "link": ""
      },

      "location": {
        "text": "Specifies the URI of the resource the client should go to after a redirection.",
        "link": ""
      },
      "from": {
        "text": "Specifies an Internet email address for the human user who controls the requesting user agent.",
        "link": ""
      },
      "host": {
        "text": "Specifies the domain name of the server (for virtual hosting), and the TCP port number on which the server is listening.",
        "link": ""
      },
      "referer": {
        "text": "Indicates the address of the previous web page from which a link to the currently requested page was followed.",
        "link": ""
      },
      "referrer-policy": {
        "text": "Controls how much referrer information should be included with requests.",
        "link": ""
      },
      "user-agent": {
        "text": "Contains information about the user agent originating the request.",
        "link": ""
      },
      "allow": {
        "text": "Specifies the HTTP methods that are allowed on a resource.",
        "link": ""
      },
      "server": {
        "text": "Contains information about the software used by the origin server.",
        "link": ""
      },
      "accept-ranges": {
        "text": "Indicates the range units supported by the server.",
        "link": ""
      },
      "range": {
        "text": "Requests only part of a resource's representation.",
        "link": ""
      },
      "if-range": {
        "text": "Performs a conditional GET request if the entity has been changed.",
        "link": ""
      },
      "content-range": {
        "text": "Indicates the partial range of the response.",
        "link": ""
      },
      "cross-origin-embedder-policy (coep)": {
        "text": "Controls whether a web page can be embedded cross-origin.",
        "link": ""
      },
      "cross-origin-opener-policy (coop)": {
        "text": "Manages how a web page interacts with other origins, enhancing security against cross-origin threats.",
        "link": ""
      },
      "cross-origin-resource-policy (corp)": {
        "text": "Governs resource sharing across origins, preventing unauthorized access and bolstering security.",
        "link": ""
      },
      "content-security-policy (csp)": {
        "text": "Controls the resources that a user agent is allowed to load for a page.",
        "link": ""
      },
      "content-security-policy-report-only": {
        "text": "Allows web developers to experiment with policies by monitoring (but not enforcing) their effects.",
        "link": ""
      },
      "expect-ct": {
        "text": "Informs the client that the site should be enforcing Certificate Transparency.",
        "link": ""
      },

      "upgrade-insecure-requests": {
        "text": "Indicates that a browser should automatically try to upgrade HTTP requests to HTTPS requests.",
        "link": ""
      },
      "x-content-type-options": {
        "text": "Prevents browsers from MIME-sniffing a response away from the declared content-type.",
        "link": ""
      },
      "x-frame-options": {
        "text": "Provides clickjacking protection by preventing the content from being embedded into other websites.",
        "link": ""
      },

      "sec-fetch-site": {
        "text": "Indicates the relationship of the target resource to the origin.",
        "link": ""
      },
      "sec-fetch-mode": {
        "text": "Specifies the request's mode.",
        "link": ""
      },
      "sec-fetch-user": {
        "text": "Specifies the user's navigation type for a request.",
        "link": ""
      },
      "sec-fetch-dest": {
        "text": "Specifies the request's destination.",
        "link": ""
      },
      "nel": {
        "text": "Informs the client of network errors and reports where they occur.",
        "link": ""
      },
      "transfer-encoding": {
        "text": "Specifies the form of encoding used to",
        "link": ""
      }
     
  }



  const handleclick = (event) => {
    if(inputText === ""){
      return
    }
    setclick(true)
    fetchData(inputText)
 
  };

  const fetchData = (arg) => {

    // setclick(true)
    setError(false)

    let query = arg


     query = formatURL(query)
    //  console.log(query)

     if(!isUrlValid(query)){

      setError(true)
      setclick(false)

      return
     }

  
 

    fetch("http://localhost:4000/api/v1/fetch_data?target=" + query) // Replace 'https://api.example.com/data' with  API endpoint
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
          
        }

        return response.json();
      })
      .then((data) => {
        // Handle the parsed JSON data
        setData(data);
        // console.log(data);
        setError(null);
   
     

        const object1 = [
          "content-security-policy",
          "referrer-policy",
          "strict-transport-security",
          "x-xss-protection",
          "x-content-type-options",
          "permissions-policy",
        ];


        let messages = data["data"]["messages"];

        // console.log(messages)

        const filterMessages = (type) => {
          const data = Array.isArray(messages) ? messages : [];
          return data.filter((item) => item.type === type);
        };

        // console.log(filterMessages("arr")[0]);

        const object2 = filterMessages("arr")[0]['field'];

        setMissing(object2);

        const set_object1 = new Set(object1);
        const set_object2 = new Set(object2);
        const presentHeader = [...set_object1].filter(
          (element) => !set_object2.has(element)
        );

        // console.log(presentHeader);

        setPresent(presentHeader);


          const upcoming = []

         filterMessages("up").map(obj => {

          upcoming.push(obj.field) 

         })
          
      

        //  console.log(upcoming)

         setUp(upcoming)


         const warning = []

         filterMessages("warn").map(obj => {

          warning.push(obj) 

         })


         setWarn(warning)

      


    

        const addfield = []

        for (const obj of filterMessages("info")) {
          if (policy.hasOwnProperty(obj.field)) {
              addfield.push(obj.field);
          }
      }

      setInfo(addfield)

        const now = getUserTimeWithTimeZone();
        setCurrentTime(now);

        setclick(false)
      })
      .catch((error) => {
        setError(true)
        console.error("There was a problem with the fetch operation:", error);
        setError(error.message);
        setclick(false)
      });
  };

  
// personalized time 

  const getUserTimeWithTimeZone = () => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const userTime = new Date().toLocaleString('en-US', {
      timeZone: userTimeZone,
      hour12: false,
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
    return userTime;
  };

  useEffect(() => {
    // ( initial render)

    fetchData('https://youtube.com')

    return () => {
      // Cleanup code 

    };
  }, []);


  

  return (
    <div className="frame-container">
      <main className="main-frame">
        <section className="secondary-frames">
          <div className="assets-area">
            <div className="site-i-p-report">
              <div className="header-footer-row">
                <div className="small-screenfalse-header-act">
                  <div className="label6">Scan your site now</div>
                  <div className={error? "err-assetsinput":"assetsinput"}>
                    <input
                      placeholder="akto.io"
                      className="label7"
                      value={inputText}
                      onChange={handleInputChange}
                    />
                    
                  </div>
                  { error && ( 
                  <span className="label-below">   
                                  
                  <img    style={{height:'12px'}}
                       
                          alt=""
                          src="/attention.svg"
                        /> {errMessage}
                        
                        </span>

                        )}      
                  
                </div>
              </div>

              {/* <SizeMediumStateDefaultFu actionButtonText="Scan" /> */}

              <button onClick={handleclick} disabled={click} className={click ?"grey-button": "purple-button"} >
               {click ? <>loading</> : <>Scan</> } 
              </button>
            </div>

        {data ? (
            <>
          


            <div className="checkbox-frame" key={uuidv4()}>
              <SecurityReportSummaryContainer securitySummaryText="Security report summary" />
              <div className="vector-separator">
                <div className="akto-logo-frame">
                  <div className="site">Site:</div>
                 {data && (<div className="httpswwwaktoio">                    <a href={'http://'+data['data']['sh']} target="_blank" rel="noopener noreferrer">
                  {data['data']['sh']}   </a></div>)} 
                </div>
                <div className="akto-logo-frame1" />
                <div className="akto-logo-frame2">
                  <div className="ip-address">IP Address:</div>
                 {data && ( <div className="div">{data['data']['ip']}</div> )} 
                </div>
                <div className="akto-logo-frame3" />
                <div className="akto-logo-frame4">
                  <div className="report-time">Report Time:</div>
                  <div className="mar-2024-094657">{currentTime}</div>
                </div>
                <div className="akto-logo-frame5" />
                <div className="content">
                  <div className="headers">Headers:</div>
                  <div className="text-input-frame">
                    {present.map((item) => (
                      <button key={uuidv4()} className="tag">
                        <img
                          className="tick-small-minor-icon"
                          alt=""
                          src="/ticksmall-minor.svg"
                        />
                        <div className="label" key={uuidv4()}>{item}</div>
                      </button>
                    ))}

                    {missing.map((item) => (
                      <button key={uuidv4()} className="tag1">
                        <img
                          className="cancel-small-minor-icon"
                          alt=""
                          src="/cancelsmall-minor.svg"
                        />
                        <div className="label">{item}</div>
                      </button>
                    ))}
                  </div>
                </div>
              
                <div className="akto-logo-frame7"></div>
              </div>
            </div>


            {data &&  (
            <div className="checkbox-frame" >
           
              <SecurityReportSummaryContainer securitySummaryText="Raw headers" />
              {/* <div className="paragraph-text-frame">
               
               
                    {Object.entries(data["data"]["headers"]).map(
                      ([key, value]) => (
                        <>
                          <div className="stricttransportsecurity" key={uuidv4()}>
                            <div className="server2">{key}</div>
                            <div className="texthtml">{value}</div>
                          </div>
                          <div className="heading-text-frame1" />
                        </>
                      )
                    )}
               
               
              </div>  */}

              <div className="paragraph-text-frame"   >
               
               
               {Object.entries(data["data"]["headers"]).map(
                 ([key, value]) => (
                   <React.Fragment key={uuidv4()}>
                     <div className="heading-text-frame" >
                       <div className="content-security-policy">{key}</div>
                       <div className="valuebox">{value}</div>
                     </div>
                     <div className="heading-text-frame1" />
                   </React.Fragment>
                 )
               )}
          
          
         </div> 






            </div> )}

            {missing.length != 0 && (

            <div className="checkbox-frame" >
              <SecurityReportSummaryContainer securitySummaryText="Missing headers" />
              <div className="paragraph-text-frame">
                
               


                {missing.map((item) => (
                      <React.Fragment key={uuidv4()} >
                        <div className="heading-text-frame" >
                  <div className="content-security-policy">
                    {item}
                  </div>
                  <div className="content-security-policy-is-container">
                    <span className="content-security-policy1">
                    <a href={policy.hasOwnProperty(item) ? policy[item]['link'] : 'https://duckduckgo.com/?q=%5C'+item+' http header'} target="_blank" rel="noopener noreferrer">
                      {item}
                    </a>
                    </span>
                    <span className="is-an-effective"> &nbsp;
                  {
                      policy.hasOwnProperty(item) ? policy[item]['text'] : ' '
                  }

                    </span>
                  </div>
                </div>

                {missing[missing.length-1]!== item && (
                <div className="heading-text-frame1" />)}
                      
                      </React.Fragment>
                    ))}

              </div>
            </div>) }

          {warn.length !=0 && (
            <div className="checkbox-frame">
              <SecurityReportSummaryContainer securitySummaryText="Warnings" />
              <div className="paragraph-text-frame">

              {warn.map((item) => (
                      < React.Fragment key={uuidv4()} >
                        <div className="heading-text-frame" >
                  <div className="content-security-policy">
                    {item.field}
                  </div>
                  <div className="content-security-policy-is-container">
                  <span style={{ color: item.text === "remove" ? "#ff6666" : "#cc9900", fontWeight: "bold" }}> [{item.text}] &nbsp;</span>

                    <span className="content-security-policy1">
                      
                    <a href={policy.hasOwnProperty(item.field) && policy[item.field]['link'] !=="" ? policy[item.field]['link'] : 'https://duckduckgo.com/?q=%5C'+item.field+' http header'} target="_blank" rel="noopener noreferrer">
                      {item.field}
                    </a>
                    </span>
                    <span className="is-an-effective"> &nbsp;
                  {
                      policy.hasOwnProperty(item.field) ? policy[item.field]['text'] : ' '
                  }

                    </span>
                  </div>
                </div>
                
                {warn[warn.length-1]!== item && (
                <div className="heading-text-frame1" />)}
                      
                      </React.Fragment>
                    ))}

                </div>
            </div> )}

            {up.length !=0 && (
            <div className="checkbox-frame" >
              <SecurityReportSummaryContainer securitySummaryText="Upcoming Headers" />

              <div className="paragraph-text-frame">
                

                {up.map((item) => (
                      < React.Fragment key={uuidv4()}>
                        <div className="heading-text-frame" >
                  <div className="content-security-policy">
                    {item}
                  </div>
                  <div className="content-security-policy-is-container">
                    <span className="content-security-policy1">
                    <a href={policy.hasOwnProperty(item) && policy[item]['link'] !== "" ? policy[item]['link'] : 'https://duckduckgo.com/?q=%5C'+item+' http header'} target="_blank" rel="noopener noreferrer">
                      {item}
                    </a>
                    </span>
                    <span className="is-an-effective"> &nbsp;
                  {
                      policy.hasOwnProperty(item) ? policy[item]['text'] : ' '
                  }

                    </span>
                  </div>
                </div>
                {up[up.length-1]!== item && (
                <div className="heading-text-frame1" />)}
                      
                      </React.Fragment>
                    ))} 



               
              </div>
             
            </div> )}

            <div className="checkbox-frame" >
              <SecurityReportSummaryContainer securitySummaryText="Additional Information" />
              <div className="server-header">
              {info.map((item) => (
                      <React.Fragment key={uuidv4()} >
                        <div className="heading-text-frame" >
                  <div className="content-security-policy">
                    {item}
                  </div>
                  <div className="content-security-policy-is-container">
                    <span className="content-security-policy1">
                    <a href={policy.hasOwnProperty(item) && policy[item]['link'] !== "" ?  policy[item]['link'] : 'https://duckduckgo.com/?q=%5C'+item+' http header'} target="_blank" rel="noopener noreferrer">
                      {item}
                    </a>
                    </span>
                    <span className="is-an-effective"> &nbsp;
                  {
                      policy.hasOwnProperty(item) ? policy[item]['text'] : ' '
                  }

                    </span>
                  </div>
                </div>

                {info[info.length-1]!==item && (
                <div className="heading-text-frame1" />)}
                      
                      </React.Fragment >
                    ))}
          
      
              </div>
            </div>

            </> ): (<p> loading .. </p>)}


          </div>
        </section>
        <footer className="assetsrow">
          <a href="https://akto.io" target="_blank" rel="noopener noreferrer">
          <img className="icon" loading="lazy" alt="" src={akto} />    </a>
          <a href="https://akto.io" target="_blank" rel="noopener noreferrer">
          <h2 className="akto">akto</h2>
          </a>       
        </footer>
      </main>
    </div>
  );
};

export default Frame;
