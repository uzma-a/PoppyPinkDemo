"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "_api_src_lib_adminCheck_js";
exports.ids = ["_api_src_lib_adminCheck_js"];
exports.modules = {

/***/ "(api)/./src/lib/adminCheck.js":
/*!*******************************!*\
  !*** ./src/lib/adminCheck.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   isAdmin: () => (/* binding */ isAdmin)\n/* harmony export */ });\n// src/lib/adminCheck.js\nfunction isAdmin(user) {\n    if (!user) return false;\n    if (user.publicMetadata?.role === \"admin\") return true;\n    const adminEmails = (process.env.ADMIN_EMAILS || \"\").split(\",\").map((e)=>e.trim().toLowerCase()).filter(Boolean);\n    const email = user.emailAddresses?.[0]?.emailAddress?.toLowerCase();\n    return email ? adminEmails.includes(email) : false;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvbGliL2FkbWluQ2hlY2suanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFBLHdCQUF3QjtBQUNqQixTQUFTQSxRQUFRQyxJQUFJO0lBQzFCLElBQUksQ0FBQ0EsTUFBTSxPQUFPO0lBQ2xCLElBQUlBLEtBQUtDLGNBQWMsRUFBRUMsU0FBUyxTQUFTLE9BQU87SUFDbEQsTUFBTUMsY0FBYyxDQUFDQyxRQUFRQyxHQUFHLENBQUNDLFlBQVksSUFBSSxFQUFDLEVBQy9DQyxLQUFLLENBQUMsS0FBS0MsR0FBRyxDQUFDQyxDQUFBQSxJQUFLQSxFQUFFQyxJQUFJLEdBQUdDLFdBQVcsSUFBSUMsTUFBTSxDQUFDQztJQUN0RCxNQUFNQyxRQUFRZCxLQUFLZSxjQUFjLEVBQUUsQ0FBQyxFQUFFLEVBQUVDLGNBQWNMO0lBQ3RELE9BQU9HLFFBQVFYLFlBQVljLFFBQVEsQ0FBQ0gsU0FBUztBQUMvQyIsInNvdXJjZXMiOlsid2VicGFjazovL3BvcHB5cGluay8uL3NyYy9saWIvYWRtaW5DaGVjay5qcz8wMWIxIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHNyYy9saWIvYWRtaW5DaGVjay5qc1xuZXhwb3J0IGZ1bmN0aW9uIGlzQWRtaW4odXNlcikge1xuICBpZiAoIXVzZXIpIHJldHVybiBmYWxzZTtcbiAgaWYgKHVzZXIucHVibGljTWV0YWRhdGE/LnJvbGUgPT09IFwiYWRtaW5cIikgcmV0dXJuIHRydWU7XG4gIGNvbnN0IGFkbWluRW1haWxzID0gKHByb2Nlc3MuZW52LkFETUlOX0VNQUlMUyB8fCBcIlwiKVxuICAgIC5zcGxpdChcIixcIikubWFwKGUgPT4gZS50cmltKCkudG9Mb3dlckNhc2UoKSkuZmlsdGVyKEJvb2xlYW4pO1xuICBjb25zdCBlbWFpbCA9IHVzZXIuZW1haWxBZGRyZXNzZXM/LlswXT8uZW1haWxBZGRyZXNzPy50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gZW1haWwgPyBhZG1pbkVtYWlscy5pbmNsdWRlcyhlbWFpbCkgOiBmYWxzZTtcbn1cbiJdLCJuYW1lcyI6WyJpc0FkbWluIiwidXNlciIsInB1YmxpY01ldGFkYXRhIiwicm9sZSIsImFkbWluRW1haWxzIiwicHJvY2VzcyIsImVudiIsIkFETUlOX0VNQUlMUyIsInNwbGl0IiwibWFwIiwiZSIsInRyaW0iLCJ0b0xvd2VyQ2FzZSIsImZpbHRlciIsIkJvb2xlYW4iLCJlbWFpbCIsImVtYWlsQWRkcmVzc2VzIiwiZW1haWxBZGRyZXNzIiwiaW5jbHVkZXMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./src/lib/adminCheck.js\n");

/***/ })

};
;