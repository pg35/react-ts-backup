const initialState = {
  items: [
    { id: "all", isDisposable: false, disposableError: "" },
    {
      id: "wpReg",
      isDisposable: false,
      disposableError: ""
    },
    { id: "cf7", isDisposable: false, disposableError: "" },
    { id: "gf", isDisposable: false, disposableError: "" },
    { id: "ff", isDisposable: false, disposableError: "" }
  ]
};
function getResponse(args) {
  if ("pxq_emlchk_init" === args.data.action) return initialState;
  return {};
}
export function doAjaxDummy(args, onSuccess, onFail, onFinally) {
  console.log(args);
  setTimeout(() => {
    onSuccess && onSuccess({ success: true, data: getResponse(args) });
    //onSuccess({ success: false, data: { message: "server error" } });
    onFail && onFail(getAjaxFailReason({ status: 403 }, "timeout1"));
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
