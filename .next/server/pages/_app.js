/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./src/context/CartContext.js":
/*!************************************!*\
  !*** ./src/context/CartContext.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CartProvider: () => (/* binding */ CartProvider),\n/* harmony export */   useCart: () => (/* binding */ useCart)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n// src/context/CartContext.js\n\n\nconst CartContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)();\nfunction CartProvider({ children }) {\n    const [cart, setCart] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);\n    // Load from localStorage on mount\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        try {\n            const saved = JSON.parse(localStorage.getItem(\"poppypink_cart\"));\n            if (Array.isArray(saved)) setCart(saved);\n        } catch (_) {}\n    }, []);\n    // Persist on change\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        localStorage.setItem(\"poppypink_cart\", JSON.stringify(cart));\n    }, [\n        cart\n    ]);\n    const addToCart = (product)=>{\n        setCart((prev)=>{\n            const existing = prev.find((i)=>i.id === product.id);\n            if (existing) return prev.map((i)=>i.id === product.id ? {\n                    ...i,\n                    qty: i.qty + 1\n                } : i);\n            return [\n                ...prev,\n                {\n                    ...product,\n                    qty: 1\n                }\n            ];\n        });\n    };\n    const removeFromCart = (id)=>setCart((prev)=>prev.filter((i)=>i.id !== id));\n    const updateQty = (id, qty)=>{\n        if (qty < 1) {\n            removeFromCart(id);\n            return;\n        }\n        setCart((prev)=>prev.map((i)=>i.id === id ? {\n                    ...i,\n                    qty\n                } : i));\n    };\n    const clearCart = ()=>setCart([]);\n    const total = cart.reduce((s, i)=>s + i.offerPrice * i.qty, 0);\n    const count = cart.reduce((s, i)=>s + i.qty, 0);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(CartContext.Provider, {\n        value: {\n            cart,\n            addToCart,\n            removeFromCart,\n            updateQty,\n            clearCart,\n            total,\n            count\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\Adeel\\\\Downloads\\\\poppypink-nextjs (2)\\\\poppypink-nextjs\\\\src\\\\context\\\\CartContext.js\",\n        lineNumber: 47,\n        columnNumber: 5\n    }, this);\n}\nfunction useCart() {\n    const ctx = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(CartContext);\n    if (!ctx) throw new Error(\"useCart must be used within CartProvider\");\n    return ctx;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29udGV4dC9DYXJ0Q29udGV4dC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSw2QkFBNkI7O0FBQzBDO0FBRXZFLE1BQU1JLDRCQUFjSixvREFBYUE7QUFFMUIsU0FBU0ssYUFBYSxFQUFFQyxRQUFRLEVBQUU7SUFDdkMsTUFBTSxDQUFDQyxNQUFNQyxRQUFRLEdBQUdOLCtDQUFRQSxDQUFDLEVBQUU7SUFFbkMsa0NBQWtDO0lBQ2xDQyxnREFBU0EsQ0FBQztRQUNSLElBQUk7WUFDRixNQUFNTSxRQUFRQyxLQUFLQyxLQUFLLENBQUNDLGFBQWFDLE9BQU8sQ0FBQztZQUM5QyxJQUFJQyxNQUFNQyxPQUFPLENBQUNOLFFBQVFELFFBQVFDO1FBQ3BDLEVBQUUsT0FBT08sR0FBRyxDQUFDO0lBQ2YsR0FBRyxFQUFFO0lBRUwsb0JBQW9CO0lBQ3BCYixnREFBU0EsQ0FBQztRQUNSUyxhQUFhSyxPQUFPLENBQUMsa0JBQWtCUCxLQUFLUSxTQUFTLENBQUNYO0lBQ3hELEdBQUc7UUFBQ0E7S0FBSztJQUVULE1BQU1ZLFlBQVksQ0FBQ0M7UUFDakJaLFFBQVEsQ0FBQ2E7WUFDUCxNQUFNQyxXQUFXRCxLQUFLRSxJQUFJLENBQUMsQ0FBQ0MsSUFBTUEsRUFBRUMsRUFBRSxLQUFLTCxRQUFRSyxFQUFFO1lBQ3JELElBQUlILFVBQ0YsT0FBT0QsS0FBS0ssR0FBRyxDQUFDLENBQUNGLElBQ2ZBLEVBQUVDLEVBQUUsS0FBS0wsUUFBUUssRUFBRSxHQUFHO29CQUFFLEdBQUdELENBQUM7b0JBQUVHLEtBQUtILEVBQUVHLEdBQUcsR0FBRztnQkFBRSxJQUFJSDtZQUVyRCxPQUFPO21CQUFJSDtnQkFBTTtvQkFBRSxHQUFHRCxPQUFPO29CQUFFTyxLQUFLO2dCQUFFO2FBQUU7UUFDMUM7SUFDRjtJQUVBLE1BQU1DLGlCQUFpQixDQUFDSCxLQUN0QmpCLFFBQVEsQ0FBQ2EsT0FBU0EsS0FBS1EsTUFBTSxDQUFDLENBQUNMLElBQU1BLEVBQUVDLEVBQUUsS0FBS0E7SUFFaEQsTUFBTUssWUFBWSxDQUFDTCxJQUFJRTtRQUNyQixJQUFJQSxNQUFNLEdBQUc7WUFBRUMsZUFBZUg7WUFBSztRQUFRO1FBQzNDakIsUUFBUSxDQUFDYSxPQUFTQSxLQUFLSyxHQUFHLENBQUMsQ0FBQ0YsSUFBT0EsRUFBRUMsRUFBRSxLQUFLQSxLQUFLO29CQUFFLEdBQUdELENBQUM7b0JBQUVHO2dCQUFJLElBQUlIO0lBQ25FO0lBRUEsTUFBTU8sWUFBWSxJQUFNdkIsUUFBUSxFQUFFO0lBRWxDLE1BQU13QixRQUFRekIsS0FBSzBCLE1BQU0sQ0FBQyxDQUFDQyxHQUFHVixJQUFNVSxJQUFJVixFQUFFVyxVQUFVLEdBQUdYLEVBQUVHLEdBQUcsRUFBRTtJQUM5RCxNQUFNUyxRQUFRN0IsS0FBSzBCLE1BQU0sQ0FBQyxDQUFDQyxHQUFHVixJQUFNVSxJQUFJVixFQUFFRyxHQUFHLEVBQUU7SUFFL0MscUJBQ0UsOERBQUN2QixZQUFZaUMsUUFBUTtRQUNuQkMsT0FBTztZQUFFL0I7WUFBTVk7WUFBV1M7WUFBZ0JFO1lBQVdDO1lBQVdDO1lBQU9JO1FBQU07a0JBRTVFOUI7Ozs7OztBQUdQO0FBRU8sU0FBU2lDO0lBQ2QsTUFBTUMsTUFBTXZDLGlEQUFVQSxDQUFDRztJQUN2QixJQUFJLENBQUNvQyxLQUFLLE1BQU0sSUFBSUMsTUFBTTtJQUMxQixPQUFPRDtBQUNUIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcG9wcHlwaW5rLy4vc3JjL2NvbnRleHQvQ2FydENvbnRleHQuanM/YjhkMSJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBzcmMvY29udGV4dC9DYXJ0Q29udGV4dC5qc1xuaW1wb3J0IHsgY3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gXCJyZWFjdFwiO1xuXG5jb25zdCBDYXJ0Q29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIENhcnRQcm92aWRlcih7IGNoaWxkcmVuIH0pIHtcbiAgY29uc3QgW2NhcnQsIHNldENhcnRdID0gdXNlU3RhdGUoW10pO1xuXG4gIC8vIExvYWQgZnJvbSBsb2NhbFN0b3JhZ2Ugb24gbW91bnRcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgc2F2ZWQgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicG9wcHlwaW5rX2NhcnRcIikpO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc2F2ZWQpKSBzZXRDYXJ0KHNhdmVkKTtcbiAgICB9IGNhdGNoIChfKSB7fVxuICB9LCBbXSk7XG5cbiAgLy8gUGVyc2lzdCBvbiBjaGFuZ2VcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInBvcHB5cGlua19jYXJ0XCIsIEpTT04uc3RyaW5naWZ5KGNhcnQpKTtcbiAgfSwgW2NhcnRdKTtcblxuICBjb25zdCBhZGRUb0NhcnQgPSAocHJvZHVjdCkgPT4ge1xuICAgIHNldENhcnQoKHByZXYpID0+IHtcbiAgICAgIGNvbnN0IGV4aXN0aW5nID0gcHJldi5maW5kKChpKSA9PiBpLmlkID09PSBwcm9kdWN0LmlkKTtcbiAgICAgIGlmIChleGlzdGluZylcbiAgICAgICAgcmV0dXJuIHByZXYubWFwKChpKSA9PlxuICAgICAgICAgIGkuaWQgPT09IHByb2R1Y3QuaWQgPyB7IC4uLmksIHF0eTogaS5xdHkgKyAxIH0gOiBpXG4gICAgICAgICk7XG4gICAgICByZXR1cm4gWy4uLnByZXYsIHsgLi4ucHJvZHVjdCwgcXR5OiAxIH1dO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHJlbW92ZUZyb21DYXJ0ID0gKGlkKSA9PlxuICAgIHNldENhcnQoKHByZXYpID0+IHByZXYuZmlsdGVyKChpKSA9PiBpLmlkICE9PSBpZCkpO1xuXG4gIGNvbnN0IHVwZGF0ZVF0eSA9IChpZCwgcXR5KSA9PiB7XG4gICAgaWYgKHF0eSA8IDEpIHsgcmVtb3ZlRnJvbUNhcnQoaWQpOyByZXR1cm47IH1cbiAgICBzZXRDYXJ0KChwcmV2KSA9PiBwcmV2Lm1hcCgoaSkgPT4gKGkuaWQgPT09IGlkID8geyAuLi5pLCBxdHkgfSA6IGkpKSk7XG4gIH07XG5cbiAgY29uc3QgY2xlYXJDYXJ0ID0gKCkgPT4gc2V0Q2FydChbXSk7XG5cbiAgY29uc3QgdG90YWwgPSBjYXJ0LnJlZHVjZSgocywgaSkgPT4gcyArIGkub2ZmZXJQcmljZSAqIGkucXR5LCAwKTtcbiAgY29uc3QgY291bnQgPSBjYXJ0LnJlZHVjZSgocywgaSkgPT4gcyArIGkucXR5LCAwKTtcblxuICByZXR1cm4gKFxuICAgIDxDYXJ0Q29udGV4dC5Qcm92aWRlclxuICAgICAgdmFsdWU9e3sgY2FydCwgYWRkVG9DYXJ0LCByZW1vdmVGcm9tQ2FydCwgdXBkYXRlUXR5LCBjbGVhckNhcnQsIHRvdGFsLCBjb3VudCB9fVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L0NhcnRDb250ZXh0LlByb3ZpZGVyPlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlQ2FydCgpIHtcbiAgY29uc3QgY3R4ID0gdXNlQ29udGV4dChDYXJ0Q29udGV4dCk7XG4gIGlmICghY3R4KSB0aHJvdyBuZXcgRXJyb3IoXCJ1c2VDYXJ0IG11c3QgYmUgdXNlZCB3aXRoaW4gQ2FydFByb3ZpZGVyXCIpO1xuICByZXR1cm4gY3R4O1xufVxuIl0sIm5hbWVzIjpbImNyZWF0ZUNvbnRleHQiLCJ1c2VDb250ZXh0IiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJDYXJ0Q29udGV4dCIsIkNhcnRQcm92aWRlciIsImNoaWxkcmVuIiwiY2FydCIsInNldENhcnQiLCJzYXZlZCIsIkpTT04iLCJwYXJzZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJBcnJheSIsImlzQXJyYXkiLCJfIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsImFkZFRvQ2FydCIsInByb2R1Y3QiLCJwcmV2IiwiZXhpc3RpbmciLCJmaW5kIiwiaSIsImlkIiwibWFwIiwicXR5IiwicmVtb3ZlRnJvbUNhcnQiLCJmaWx0ZXIiLCJ1cGRhdGVRdHkiLCJjbGVhckNhcnQiLCJ0b3RhbCIsInJlZHVjZSIsInMiLCJvZmZlclByaWNlIiwiY291bnQiLCJQcm92aWRlciIsInZhbHVlIiwidXNlQ2FydCIsImN0eCIsIkVycm9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/context/CartContext.js\n");

/***/ }),

/***/ "./src/pages/_app.js":
/*!***************************!*\
  !*** ./src/pages/_app.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./src/styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _clerk_nextjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @clerk/nextjs */ \"@clerk/nextjs\");\n/* harmony import */ var _clerk_nextjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_clerk_nextjs__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _context_CartContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../context/CartContext */ \"./src/context/CartContext.js\");\n// src/pages/_app.js\n\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_clerk_nextjs__WEBPACK_IMPORTED_MODULE_2__.ClerkProvider, {\n        publishableKey: \"pk_test_Y2xpbWJpbmctZWVsLTY1LmNsZXJrLmFjY291bnRzLmRldiQ\",\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_context_CartContext__WEBPACK_IMPORTED_MODULE_3__.CartProvider, {\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Adeel\\\\Downloads\\\\poppypink-nextjs (2)\\\\poppypink-nextjs\\\\src\\\\pages\\\\_app.js\",\n                lineNumber: 12,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\Adeel\\\\Downloads\\\\poppypink-nextjs (2)\\\\poppypink-nextjs\\\\src\\\\pages\\\\_app.js\",\n            lineNumber: 11,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\Adeel\\\\Downloads\\\\poppypink-nextjs (2)\\\\poppypink-nextjs\\\\src\\\\pages\\\\_app.js\",\n        lineNumber: 8,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLG9CQUFvQjs7QUFDVztBQUNlO0FBQ1E7QUFFdkMsU0FBU0UsSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBRTtJQUNsRCxxQkFDRSw4REFBQ0osd0RBQWFBO1FBQ1pLLGdCQUFnQkMseURBQTZDO2tCQUU3RCw0RUFBQ0wsOERBQVlBO3NCQUNYLDRFQUFDRTtnQkFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7Ozs7Ozs7O0FBSWhDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcG9wcHlwaW5rLy4vc3JjL3BhZ2VzL19hcHAuanM/OGZkYSJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBzcmMvcGFnZXMvX2FwcC5qc1xuaW1wb3J0IFwiLi4vc3R5bGVzL2dsb2JhbHMuY3NzXCI7XG5pbXBvcnQgeyBDbGVya1Byb3ZpZGVyIH0gZnJvbSBcIkBjbGVyay9uZXh0anNcIjtcbmltcG9ydCB7IENhcnRQcm92aWRlciB9IGZyb20gXCIuLi9jb250ZXh0L0NhcnRDb250ZXh0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8Q2xlcmtQcm92aWRlclxuICAgICAgcHVibGlzaGFibGVLZXk9e3Byb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0NMRVJLX1BVQkxJU0hBQkxFX0tFWX1cbiAgICA+XG4gICAgICA8Q2FydFByb3ZpZGVyPlxuICAgICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgICA8L0NhcnRQcm92aWRlcj5cbiAgICA8L0NsZXJrUHJvdmlkZXI+XG4gICk7XG59XG4iXSwibmFtZXMiOlsiQ2xlcmtQcm92aWRlciIsIkNhcnRQcm92aWRlciIsIkFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyIsInB1Ymxpc2hhYmxlS2V5IiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX0NMRVJLX1BVQkxJU0hBQkxFX0tFWSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/pages/_app.js\n");

/***/ }),

/***/ "./src/styles/globals.css":
/*!********************************!*\
  !*** ./src/styles/globals.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "@clerk/nextjs":
/*!********************************!*\
  !*** external "@clerk/nextjs" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@clerk/nextjs");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./src/pages/_app.js"));
module.exports = __webpack_exports__;

})();