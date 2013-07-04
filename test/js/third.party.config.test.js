(function (window, document, $, undefined) {
    function runTests() {
        module('Third party gpt');

        test('Config get/set', function () {
            var result, obj,
                key = 'key',
                invalid = 'invalid',
                value = 'value',
                value2 = 'value2';

            expect(10);

            ok(FT.ads.config.set, 'The set method exists');
            ok(FT.ads.config.get, 'The get method exists');

            result = FT.ads.config.set();
            deepEqual(result, undefined, 'set without params returns undefined.');

            result = FT.ads.config.set(key);
            deepEqual(result, undefined, 'running set without a value returns undefined.');

            result = FT.ads.config.set(key, value);
            deepEqual(result, value, 'set with a key and value returns the value.');

            result = FT.ads.config.get();
            obj = {};
            obj[key] = value;
            deepEqual(result, obj, 'get without params returns all config.');

            result = FT.ads.config.get(key);
            deepEqual(result, value, 'get with a valid key returns the value.');

            result = FT.ads.config.get(invalid);
            deepEqual(result, undefined, 'get with an invalid key returns the undefined.');

            result = FT.ads.config.set(key, value2);
            deepEqual(result, value2, 'set an existing key returns the new value.');

            result = FT.ads.config.get(key);
            deepEqual(result, value2, 'get returns the new value.');
        });

        test('Config fetchMetaConfig', function () {

           expect(2);

            // add a couple of meta tags to the page
            var meta1 = $('body').append('<meta name="metaParam1" content="metaValue1">'),
                meta2 = $('body').append('<meta name="metaParam2" content="metaValue2">'),
                result = FT.ads.config.fetchMetaConfig(),
                expected = {
                    metaParam1: 'metaValue1',
                    metaParam2: 'metaValue2'
                };

            notEqual(FT.ads.config, undefined, 'Config object is not undefined');
            deepEqual(result, expected, 'return an object of meta values.');

            meta1.remove();
            meta2.remove();
         });

        test('Config fetchGlobalConfig', function () {

           expect(2);

            FT.env = {
                envParam1: 'envValue1',
                envParam2: 'envValue2'
            };

            var result = FT.ads.config.fetchGlobalConfig(),
                expected = {
                    envParam1: 'envValue1',
                    envParam2: 'envValue2'
                };
            notEqual(FT.ads.config, undefined, 'Config object is not undefined');
            deepEqual(result, expected, 'return an object of global values.');
        });
    }

    $(runTests);
}(window, document, jQuery));
