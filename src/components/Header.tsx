import React from "react";
import { GAME_TITLE } from "../lib/constants";

export default function Header() {
    return (
        <div className="text-h1 font-classic border-b py-1 border-gray-700">{GAME_TITLE}</div>
    );
}