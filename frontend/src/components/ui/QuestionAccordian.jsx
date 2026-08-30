import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const QuestionAccordion = ({ item, index }) => {
    const [open, setOpen] = React.useState(false);

    return (
        <div className="border border-gray-200 bg-white rounded-xl mb-3 shadow-sm overflow-hidden">
            {/* Header / Question Title */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full text-left p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
            >
                <span className="text-sm font-semibold text-gray-800">
                    {item.question}
                </span>
                <span className="text-xs text-gray-400 font-bold ml-2">
                    {open ? "▲ Hide Answer" : "▼ View Answer"}
                </span>
            </button>

            {/* Answer Content rendered via ReactMarkdown */}
            {open && (
                <div className="p-4 border-t border-gray-100 text-xs text-gray-700 leading-relaxed bg-white">
                    <ReactMarkdown
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={vscDarkPlus}
                                        language={match[1]}
                                        PreTag="div"
                                        className="rounded-lg my-2 text-xs"
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className="bg-gray-100 text-emerald-600 font-mono px-1 py-0.5 rounded text-[11px]" {...props}>
                                        {children}
                                    </code>
                                );
                            }
                        }}
                    >
                        {item.answer}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    );
};

export default QuestionAccordion;