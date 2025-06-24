import React, { useState } from 'react';

const TesteTMDB = () => {
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    // SUBSTITUA PELA SUA API KEY
    const API_KEY = '356b17524ed0a5282433261f3f0305f9';

    const testAPI = async () => {
        setLoading(true);
        setResult('Testando...');

        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR`
            );

            if (response.ok) {
                const data = await response.json();
                setResult(`✅ SUCESSO! Encontrei ${data.results.length} filmes. Primeiro filme: "${data.results[0].title}"`);
            } else {
                setResult(`❌ ERRO: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            setResult(`❌ ERRO: ${error.message}`);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                <h1 className="text-2xl font-bold mb-6">Teste API TMDB</h1>

                <button
                    onClick={testAPI}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg mb-4 w-full"
                >
                    {loading ? 'Testando...' : 'Testar API'}
                </button>

                {result && (
                    <div className={`p-4 rounded-lg ${result.includes('✅') ? 'bg-green-100 text-green-800' :
                        result.includes('❌') ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                        }`}>
                        {result}
                    </div>
                )}

                <div className="mt-6 text-sm text-gray-600">
                    <p><strong>API Key:</strong> ✅ Configurada</p>
                </div>
            </div>
        </div>
    );
};

export default TesteTMDB;