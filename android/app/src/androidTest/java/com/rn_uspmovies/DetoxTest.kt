package com.rn_uspmovies

// camada: infra (ferramental de teste) — ponte entre o instrumentador do
// Android (androidTest) e o runner Jest do Detox rodando fora do device.
// Não conhece nada do domínio do app; só delega pro Detox.

import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import com.wix.detox.Detox
import com.wix.detox.config.DetoxConfig
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
@LargeTest
class DetoxTest {

    @Test
    fun runDetoxTests() {
        val detoxConfig = DetoxConfig()
        detoxConfig.idlePolicyConfig.masterTimeoutSec = 90
        detoxConfig.idlePolicyConfig.idleResourceTimeoutSec = 60
        detoxConfig.rnContextLoadTimeoutSec = if (BuildConfig.DEBUG) 180 else 8

        Detox.runTests(this, detoxConfig)
    }
}
