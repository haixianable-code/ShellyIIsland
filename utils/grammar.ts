
/**
 * 西语语法算法工具
 */

// 简单的西语复数化逻辑
export const pluralize = (word: string): string => {
  if (/[aeiouáéíóú]$/i.test(word)) return word + 's';
  if (word.endsWith('z')) return word.slice(0, -1) + 'ces';
  return word + 'es';
};

// 自动生成规则动词变位
export const generateRegularForms = (verb: string): string => {
  let root = verb.slice(0, -2);
  let type = verb.slice(-2);
  let prefix = ['', '', '', '', '', ''];

  // 处理自复动词 (e.g., lavarse)
  if (verb.endsWith('se')) {
    const infinitive = verb.slice(0, -2);
    root = infinitive.slice(0, -2);
    type = infinitive.slice(-2);
    prefix = ['me ', 'te ', 'se ', 'nos ', 'os ', 'se '];
  }

  if (type === 'ar') {
    return `${prefix[0]}${root}o, ${prefix[1]}${root}as, ${prefix[2]}${root}a, ${prefix[3]}${root}amos, ${prefix[4]}${root}áis, ${prefix[5]}${root}an`;
  }
  if (type === 'er') {
    return `${prefix[0]}${root}o, ${prefix[1]}${root}es, ${prefix[2]}${root}e, ${prefix[3]}${root}emos, ${prefix[4]}${root}éis, ${prefix[5]}${root}en`;
  }
  if (type === 'ir') {
    return `${prefix[0]}${root}o, ${prefix[1]}${root}es, ${prefix[2]}${root}e, ${prefix[3]}${root}imos, ${prefix[4]}${root}ís, ${prefix[5]}${root}en`;
  }
  return '';
};
