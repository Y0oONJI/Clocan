// src/lib/logger.ts
type Level = "info" | "error";

function time() {
  return new Date().toISOString();
}

/**
 * 에러 객체를 안전하게 직렬화
 * 순환 참조나 직렬화 불가능한 속성 제거
 */
function serializeError(error: any): any {
  if (!error) return error;
  
  // Error 객체인 경우 주요 정보만 추출
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }
  
  // 일반 객체인 경우 JSON 직렬화 시도
  const seen = new WeakSet(); // 매 호출마다 새로 생성
  try {
    // 순환 참조 방지를 위해 깊은 복사 시도
    return JSON.parse(JSON.stringify(error, (key, value) => {
      // 순환 참조 감지: 이미 본 객체는 제외
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }
      return value;
    }, 2));
  } catch {
    // 직렬화 실패 시 문자열로 변환
    return String(error);
  }
}

/**
 * 메타데이터를 안전하게 처리
 */
function safeSerializeMeta(meta?: any): any {
  if (meta === undefined || meta === null) {
    return undefined;
  }
  
  // 빈 객체 체크
  if (typeof meta === 'object' && Object.keys(meta).length === 0) {
    return undefined;
  }
  
  // 에러 객체가 포함된 경우 처리
  if (meta.error) {
    const { error, ...rest } = meta;
    return {
      ...rest,
      error: serializeError(error),
    };
  }
  
  // 일반 메타데이터는 그대로 반환
  return meta;
}

function print(level: Level, scope: string, event: string, meta?: any) {
  const prefix = `[${time()}][FE][${level.toUpperCase()}][${scope}] ${event}`;
  const safeMeta = safeSerializeMeta(meta);
  
  if (safeMeta !== undefined) {
    // console.error는 여러 인자를 받을 수 있음
    console[level === "info" ? "log" : "error"](prefix, safeMeta);
  } else {
    console[level === "info" ? "log" : "error"](prefix);
  }
}

export const logger = {
  info: (scope: string, event: string, meta?: any) => print("info", scope, event, meta),
  error: (scope: string, event: string, meta?: any) => print("error", scope, event, meta),
};

