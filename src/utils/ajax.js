window.ajaxTest = {
  responses: {},
  result:1, //1 success, 0 failure,
};
export function doAjaxDummy(args, onSuccess, onFail, onFinally) {
  console.log("ajax args", args);
  setTimeout(() => {
    window.ajaxTest.result ?
    onSuccess && 
      onSuccess({ success: true, data: window.ajaxTest.responses[args.data.action] })
    : onFail && onFail(getAjaxFailReason({...{ status: 500 },...window.ajaxTest.responses[args.data.action]}, "timeout1"));
    onFinally && onFinally();
  }, 1000);
}

export function doAjax(args, onSuccess, onFail, onFinally) {
  return window.jQuery
    .ajax(window.ajaxurl, { type: "GET", dataType: "json", ...args })
    .done((data, textStatus, jqXHR) => {
      //console.log("done", data, onSuccess);
      onSuccess && onSuccess(data);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      onFail && onFail(getAjaxFailReason(jqXHR, textStatus));
    })
    .always(() => {
      onFinally && onFinally();
    });
}
function getAjaxFailReason(x, exception) {
  var message;
  var statusErrorMap = {
    "0": "Not connected.Please verify your network connection.",
    "400": "Server understood the request, but request content was invalid.",
    "401": "Unauthorized access.",
    "403": "Forbidden resource can't be accessed.",
    "500": "Internal server error.",
    "503": "Service unavailable."
  };
  console.log(x, exception);
  if (x && "undefined" !== typeof x.status && exception !== "abort") {
    message = statusErrorMap[x.status];
  }
  if (!message) {
    if (exception === "parsererror") {
      message = "Parsing JSON failed";
    } else if (exception === "timeout") {
      message = "Request Timed out";
    } else if (exception === "abort") {
      message = "Request aborted";
    } else {
      message = "";
    }
  }
  return message;
}
