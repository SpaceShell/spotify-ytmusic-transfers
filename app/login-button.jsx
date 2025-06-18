"use client"

export function LoginButton({clickFunc, text}) {
  return (
    <button type="button" className="px-5 py-3 bg-blue-700 rounded-md font-bold text-white" onClick={clickFunc}>{text}</button>
  );
}