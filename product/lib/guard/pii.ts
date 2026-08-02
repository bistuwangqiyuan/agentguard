export type PiiFinding = {
  type: string;
  value: string;
  start: number;
  end: number;
};

export type PiiCheckResult = {
  pass: boolean;
  findings: PiiFinding[];
  redacted_text: string;
};

const PATTERNS: Array<{ type: string; re: RegExp }> = [
  { type: "email", re: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi },
  {
    type: "phone",
    re: /\b(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}\b/g,
  },
  { type: "ssn", re: /\b\d{3}-\d{2}-\d{4}\b/g },
  { type: "credit_card", re: /\b(?:\d[ -]*?){13,19}\b/g },
  {
    type: "api_key",
    re: /\b(?:sk|pk|rk|ak|ag)[_-](?:live|test|proj)?[_-]?[A-Za-z0-9]{16,}\b/g,
  },
  {
    type: "aws_access_key",
    re: /\bAKIA[0-9A-Z]{16}\b/g,
  },
  {
    type: "private_key_header",
    re: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
  },
];

function luhnOk(num: string): boolean {
  const digits = num.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function checkPii(text: string): PiiCheckResult {
  const findings: PiiFinding[] = [];
  for (const { type, re } of PATTERNS) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const value = m[0];
      if (type === "credit_card" && !luhnOk(value)) continue;
      if (type === "phone" && value.replace(/\D/g, "").length < 10) continue;
      findings.push({
        type,
        value,
        start: m.index,
        end: m.index + value.length,
      });
    }
  }
  // merge overlapping, redact from end
  const sorted = [...findings].sort((a, b) => b.start - a.start);
  let redacted = text;
  const seen = new Set<string>();
  for (const f of sorted) {
    const key = `${f.start}:${f.end}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const mask = `[REDACTED_${f.type.toUpperCase()}]`;
    redacted = redacted.slice(0, f.start) + mask + redacted.slice(f.end);
  }
  // de-dupe findings by start/end for response (ascending)
  const uniq = [...findings]
    .sort((a, b) => a.start - b.start)
    .filter((f, i, arr) => i === 0 || f.start !== arr[i - 1].start || f.end !== arr[i - 1].end);

  return {
    pass: uniq.length === 0,
    findings: uniq.map(({ type, value, start, end }) => ({
      type,
      value: maskPreview(value),
      start,
      end,
    })),
    redacted_text: redacted,
  };
}

function maskPreview(v: string): string {
  if (v.length <= 4) return "****";
  return `${v.slice(0, 2)}…${v.slice(-2)}`;
}
