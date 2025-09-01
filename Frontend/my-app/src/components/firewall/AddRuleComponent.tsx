"use client";

import { useState } from "react";
import { config } from "@/config/env";

type RuleType = "ip" | "port" | "url";
type ModeType = "whitelist" | "blacklist";

interface AddRuleForm {
  ruleType: RuleType;
  mode: ModeType;
  values: string[];
}

export default function AddRuleComponent() {
  const [form, setForm] = useState<AddRuleForm>({
    ruleType: "ip",
    mode: "whitelist",
    values: [""],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const addValueField = () => {
    setForm((prev) => ({
      ...prev,
      values: [...prev.values, ""],
    }));
  };

  const removeValueField = (index: number) => {
    setForm((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
    }));
  };

  const updateValue = (index: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      values: prev.values.map((v, i) => (i === index ? value : v)),
    }));
  };

  const validateForm = (): boolean => {
    if (form.values.length === 0 || form.values.some((v) => !v.trim())) {
      setMessage({ type: "error", text: "All fields must be filled" });
      return false;
    }

    // Validate based on rule type
    const validators = {
      ip: (value: string) =>
        /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
          value
        ),
      port: (value: string) =>
        /^\d{1,5}$/.test(value) &&
        parseInt(value) > 0 &&
        parseInt(value) <= 65535,
      url: (value: string) =>
        /^https?:\/\/.+/.test(value) ||
        /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
    };

    const validator = validators[form.ruleType];
    if (!form.values.every(validator)) {
      setMessage({ type: "error", text: `Invalid ${form.ruleType} format` });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const endpoint =
        form.ruleType === "ip"
          ? "/ip/add"
          : form.ruleType === "port"
          ? "/port/add"
          : "/url/add";

      const response = await fetch(`${config.serverUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: form.values,
          mode: form.mode,
        }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: `${form.ruleType.toUpperCase()} rule added successfully`,
        });
        setForm({ ruleType: "ip", mode: "whitelist", values: [""] });
      } else {
        const error = await response.json();
        setMessage({
          type: "error",
          text: error.message || "Failed to add rule",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Network error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h3 className="text-[17px] font-semibold mb-4">Add New Rule</h3>

      {message && (
        <div
          className={`p-3 rounded mb-4 ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rule Type Selection */}
        <div>
          <label className="block text-sm font-medium text-[var(--secondary)] mb-2">
            Rule Type
          </label>
          <select
            value={form.ruleType}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                ruleType: e.target.value as RuleType,
              }))
            }
            className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
          >
            <option value="ip">IP Address</option>
            <option value="port">Port</option>
            <option value="url">URL</option>
          </select>
        </div>

        {/* Mode Selection */}
        <div>
          <label className="block text-sm font-medium text-[var(--secondary)] mb-2">
            Mode
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="whitelist"
                checked={form.mode === "whitelist"}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    mode: e.target.value as ModeType,
                  }))
                }
                className="mr-2"
              />
              Whitelist
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="blacklist"
                checked={form.mode === "blacklist"}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    mode: e.target.value as ModeType,
                  }))
                }
                className="mr-2"
              />
              Blacklist
            </label>
          </div>
        </div>

        {/* Values Input */}
        <div>
          <label className="block text-sm font-medium text-[var(--secondary)] mb-2">
            {form.ruleType === "ip"
              ? "IP Addresses"
              : form.ruleType === "port"
              ? "Port Numbers"
              : "URLs"}
          </label>
          <div className="space-y-2">
            {form.values.map((value, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateValue(index, e.target.value)}
                  placeholder={
                    form.ruleType === "ip"
                      ? "192.168.1.1"
                      : form.ruleType === "port"
                      ? "80"
                      : "example.com"
                  }
                  className="flex-1 px-3 py-2 border border-[var(--separator)] rounded-md focus:outline-none focus:ring-2"
                  style={{
                    background: "var(--input-bg)",
                    color: "var(--foreground)",
                    outlineColor: "var(--tint)",
                  }}
                />
                {form.values.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeValueField(index)}
                    className="px-3 py-2 text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addValueField}
              className="text-[var(--tint)] hover:opacity-80 text-sm"
            >
              + Add another {form.ruleType}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-white text-black py-2 px-4 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Adding Rule..." : "Add Rule"}
        </button>
      </form>
    </div>
  );
}
