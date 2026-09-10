package com.rn_uspmovies

// camada: infra (ferramental de teste) — ponte entre o instrumentador do
// Android (androidTest) e o runner Jest do Detox rodando fora do device.
// Não conhece nada do domínio do app; só delega pro Detox.

import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import androidx.test.rule.ActivityTestRule
import com.wix.detox.Detox
import com.wix.detox.config.DetoxConfig
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
@LargeTest
class DetoxTest {

    // launchActivity = false: quem abre a MainActivity é o Detox, no momento
    // do `device.launchApp()` de cada spec — não o JUnit ao instalar a regra.
    @get:Rule
    val activityRule = ActivityTestRule(MainActivity::class.java, false, false)

    @Test
    fun runDetoxTests() {
        val detoxConfig = DetoxConfig()
        detoxConfig.idlePolicyConfig.masterTimeoutSec = 90
        detoxConfig.idlePolicyConfig.idleResourceTimeoutSec = 60
        // Em debug o bundle vem do Metro (transpila na hora), por isso o
        // contexto do RN demora bem mais a subir do que num build release.
        detoxConfig.rnContextLoadTimeoutSec = if (BuildConfig.DEBUG) 180 else 60

        Detox.runTests(activityRule, detoxConfig)
    }
}
